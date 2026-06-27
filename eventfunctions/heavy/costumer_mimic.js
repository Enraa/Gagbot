const path = require("node:path");
const { getDressProtocolOutfit } = require("../../functions/getters/config/getDressProtocolOutfit");
const { getHeavy } = require("../../functions/getters/heavy/getHeavy");
const { handleDressProtocol } = require("../../functions/other/handleDressProtocol.js");
const { removeHeavy } = require("../../functions/setters/heavy/removeHeavy.js");
const { markForSave } = require("../../functions/other/markForSave.js");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel.js");

/**********
 * Event for Dress Protocol. This is a subclass of tick events, but comes with the heavy bondage object in question. 
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The user this is for
 * - (heavy object) heavy - The output from getHeavy for this bondage
 * ---
 * Dress Protocol Stages consist of the following:
 * - Stage 0: The prep work handled by the heavy bondage before engaging the Dress Protocol. This sets up the DP object. 
 * - Stage 1: Strip away the clothing until nothing is left, excluding locked and .excludeWearable
 * - Stage 2: Dress each item in .items until all are found on the user. Remove offending clothing if necessary.
 * - Stage 3: Pre-finalized Step. Remove offending clothing if necessary. 
 * - Stage 4: Remove the Heavy Bondage that invoked the dressprotocol. 
 * - --> Additional stages beyond this can be handled, but the final stage MUST remove the heavy restraint. 
 * ---
 * The .dressprotocol should be inserted with the following info:
 * - dressprotocolname: This heavy bondage's name 
 * - name: Name of the outfit
 * - keyholder?: User ID to give keyed restraints to, if any.
 * - stage: integer, starting at 0
 * - items: An array of strings with items to equip. The array will be equipped in order.
 * - excludeWearable: An array of strings in wearables that will be ignored
 * - ignoreclothing?: If true, skips the removal step entirely.
 * - cooldown: Rate between updates. Defaults to 20000ms.
 * - nextupdate: The timestamp the next update is permitted.
 **********/
let dressprotocoltick = async (serverID, userID, heavy) => {
    if (!heavy.dressprotocol) {
        // Getting the dpoutfit ensures that user tags are respected for preference and blocks. 
        let dpoutfit = getDressProtocolOutfit(serverID, userID)
        heavy.dressprotocol = {
            dressprotocolname: heavy.displayname,
            name: dpoutfit.name,
            keyholder: heavy.origbinder,
            stage: 0,
            prevstage: 0,
            items: dpoutfit.items,
            excludeWearable: [],
            ignoreclothing: false,
            cooldown: 20000,
            nextupdate: Date.now() + 5000,
            heavyid: path.basename(__filename, ".js")
        }
        console.log(`Chose the ${heavy.dressprotocol.dressprotocolname} Outfit!`);
        console.log(heavy.dressprotocol.items);
    }
    else {
        if (heavy.dressprotocol.stage >= 4) {
            removeHeavy(serverID, userID, path.basename(__filename, ".js"))
            return;
        }
        // My brain is failing me right now but we need to figure out a way to catch the "already naked" case
        // This is a simple race condition my brain refuses to figure out. 
        handleDressProtocol(serverID, userID, heavy.dressprotocol);
        if ((heavy.dressprotocol.nextupdate < Date.now()) && getRecentChannel(serverID, userID).valid) {
            heavy.dressprotocol.nextupdate = (Date.now() + heavy.dressprotocol.cooldown);
        }
        markForSave("heavy");
    }
}

let tick = async (serverID, userID, datain) => {
    let thisheavyrestraint = getHeavy(serverID, userID, path.basename(__filename, ".js"));
    if (thisheavyrestraint && dressprotocoltick) { 
        await dressprotocoltick(serverID, userID, thisheavyrestraint);
    }
}

console.log(`WHAT THE FUCKING SHIT`)

exports.tick = tick;