const { arrayShuffle } = require('./arrayShuffle');
const { getItemType } = require('../getters/config/getItemType');
const { getChastity } = require('../getters/chastity/getChastity');
const { getChastityBra } = require('../getters/chastity/getChastityBra');
const { getCollar } = require('../getters/collar/getCollar');
const { getGags } = require('../getters/gag/getGags');
const { getMitten } = require('../getters/mitten/getMitten');
const { getCorset } = require('../getters/corset/getCorset');
const { getHeavyList } = require('../getters/heavy/getHeavyList');
const { getToys } = require('../getters/toy/getToys');
const { assignWearable } = require('../setters/wearable/assignWearable');
const { assignChastity } = require('../setters/chastity/assignChastity');
const { assignChastityBra } = require('../setters/chastity/assignChastityBra');
const { assignCollar } = require('../setters/collar/assignCollar');
const { assignGag } = require('../setters/gag/assignGag');
const { assignMitten } = require('../setters/mitten/assignMitten');
const { assignCorset } = require('../setters/corset/assignCorset');
const { assignHeavy } = require('../setters/heavy/assignHeavy');
const { getBaseHeavy } = require('../getters/heavy/getBaseHeavy');
const { assignHeadwear } = require('../setters/headwear/assignHeadwear');
const { assignToy } = require('../setters/toy/assignToy');
const { getItemName } = require('../getters/config/getItemName');
const { removeHeavy } = require('../setters/heavy/removeHeavy');
const { getItemTags } = require('../getters/config/getItemTags');
const { getRecentChannel } = require("../getters/config/getRecentChannel");
const { getHeadwear } = require("../getters/headwear/getHeadwear");
const { getLockedHeadgear } = require("../getters/headwear/getLockedHeadgear");
const { getLockedWearable } = require("../getters/wearable/getLockedWearable");
const { getWearable } = require("../getters/wearable/getWearable");
const { messageSendChannel } = require("../messagefunctions");
const { removeWearable } = require("../setters/wearable/removeWearable");
const { getText } = require("../textfunctions");
const { getWearableName } = require('../getters/wearable/getWearableName');

/************* 
 * Perform the next step in the dress protocol. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user in the dress protocol
 * - (heavyobject) dp - The heavy bondage with the dress protocol anchored to it
 * 
 * ---
 * Dress Protocol Stages consist of the following:
 * - Stage 0: The prep work handled by the heavy bondage before engaging the Dress Protocol. This sets up the DP object. 
 * - Stage 1: Strip away the clothing until nothing is left, excluding locked and .excludeWearable
 * - Stage 2: Dress each item in .items until all are found on the user. Remove offending clothing if necessary.
 * - Stage 3: Pre-finalized Step. Remove offending clothing if necessary. 
 * - Stage 4: Remove the Heavy Bondage that invoked the dressprotocol. 
 *************/
function handleDressProtocol(serverID, userID, dp) {
    // Set up data object for the text output
    let data = {
        textarray: "texts_dressprotocol",
        textdata: {
            serverID: serverID,
            interactionuser: { id: userID },
            targetuser: { id: userID },
            c1: dp.dressprotocolname, // Heavy Bondage name,
        //  c2: (The items removed, or the item equipped
        //  c3: Not used
            c4: dp.name // Outfit name,
        /// nomtags: Array of items' tags if c2 is used!   
        }
    }

    // Tag the heavyrestraintname first
    data[dp.heavyid] = true;

    // If the user does NOT have a recentchannels object, just leave. 
    if (!getRecentChannel(serverID, userID).valid) { return }

    // If it's not time to do the next update, also just leave. 
    if (dp.nextupdate > Date.now()) { return }

    // Tag the heavy bondage in question

    // Tag the stage first
    data[`stage${dp.stage}`] = true;

    // Remove any eligible clothing. Returns false if it can't remove, otherwise, will return the item IDs it nommed. 
    function removeSomeClothing() {
        // If .ignoreclothing is specified, then return false. 
        if (dp.ignoreclothing) { return false };

        // Get worn clothing minus locked wearables
        let currclothes = getWearable(serverID, userID).filter((f) => (!getLockedWearable(serverID, userID).includes(f))); // Current clothes that can be removed

        // Filter out any clothing that is part of dp.excludeWearable
        currclothes = currclothes.filter((f) => (!dp.excludeWearable.includes(f)))

        // Filter out any clothing that is already on the list of clothes we're adding. 
        currclothes = currclothes.filter((f) => (!dp.items.includes(f)))

        // Shuffle the currclothes array
        arrayShuffle(currclothes)

        // Om nom nom nom nom
        let nommed = [];
        let nomtags = [];

        // If any currclothes remain, attempt to remove up to a third of items, until dp.removestages reaches 3 or higher. At 3, remove all remaining items. 
        if (currclothes.length > 0) {
            if (dp.removestages >= 3) {
                currclothes.forEach((c) => {
                    nomtags.push(getItemTags(c));
                    removeWearable(serverID, userID, c);
                    nommed.push(getWearableName(undefined, c) ?? c);
                })
            }
            else {
                // Splice the array at length 67% of the way in - this will select the trailing third of the clothing list.
                // At 1 item, we select 1 item
                // At 2 items, we select 1 item
                // At 3 items, we select 1 item
                // At 4 items, we select 2 items
                // At 5 items, we select 2 items
                // At 6 items, we select 2 items
                // At 7 items, we select 3 items
                //
                // Thus as an example, 7 items to remove, we do 7 (3) -> 4 (2) -> 2 (2) -> 0 (remaining 2)
                // At 5 items to remove, we do 5 (2) -> 3 (1) -> 2 (1) -> 1 (remaining 1)
                // This ensures 4 stages of clothing removal. 
                let subclothes = currclothes.splice(Math.floor(currclothes.length * 0.67))

                // Remove the clothes! 
                subclothes.forEach((c) => {
                    nomtags.push(getItemTags(c));
                    removeWearable(serverID, userID, c);
                    nommed.push(getWearableName(undefined, c) ?? c);
                })
            }
        }

        // If Nommed is of any length, then we need to report it. 
        if (nommed.length > 0) {
            dp.removestages++;
            return { nommed: nommed, nomtags: nomtags };
        }
        else {
            return false;
        }
    }

    // If the stage is 0, then just increment to 1 and return. 
    if (dp.stage <= 0) { 
        messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);
        dp.stage++;
        return;
    }

    // If the stage is 1, then remove all offending clothing from the wearer. 
    // We will first retrieve all wearables and filter out any that are in locked. 
    if (dp.stage == 1) {
        let noms = removeSomeClothing(); // { nommed, nomtags }

        // If we removed some clothing, then we should indicate which items were removed. 
        if (noms) {
            // We nommed something. 
            data["nom"] = true;

            // Add the nomtags to the list
            data.textdata.nomtags = noms.nomtags;

            // Join the noms into a string
            data.textdata.c2 = noms.nommed.join(", ");
            // And then take the last ", " and turn it into ", and "
            if (data.textdata.c2.lastIndexOf(", ") != -1) {
                data.textdata.c2 = `${data.textdata.c2.substring(0, (data.textdata.c2.lastIndexOf(", ")))}${(noms.nommed.length > 2) ? "," : ""} and ${noms.nommed[noms.nommed.length-1]}`
            }

            // If we removed multiple then tag accordingly. 
            if (noms.nommed.length > 1) { 
                data["multiple"] = true
            }
            else {
                data["single"] = true;
            }

            messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);
            return;
        }
        // We did NOT nom any clothing now. This is fine. 
        else {
            data["endstage"] = true;
            messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);
            dp.stage++;
            return;
        }
    }

    // If the stage is 2, then we want to try to put some of our items on the wearer. 
    // This can consist of items of any type. We will select them using the 
    // If the item is invalid, scream it out in the console. 
    // For compatibility's sake, "itemtowear" will be checked, but these should be adjusted to remove the category param and use an array of colors, if allowed.
    // This is set on the heavy bondage's individual "dressprotocol" event, if specified. See there. 
    if (dp.stage == 2) {
        // First check if there are any clothes to remove
        let noms = removeSomeClothing();

        // If we removed some clothing, then we should indicate which items were removed. 
        if (noms) {
            // We nommed something. 
            data["nom"] = true;

            // Add the nomtags to the list
            data.textdata.nomtags = noms.nomtags;

            // Join the noms into a string
            data.textdata.c2 = noms.nommed.join(", ");
            // And then take the last ", " and turn it into ", and "
            if (data.textdata.c2.lastIndexOf(", ") != -1) {
                data.textdata.c2 = `${data.textdata.c2.substring(0, (data.textdata.c2.lastIndexOf(", ")))}${(noms.nommed.length > 2) ? "," : ""} and ${noms.nommed[noms.nommed.length-1]}`
            }

            // If we removed multiple then tag accordingly. 
            if (noms.nommed.length > 1) { 
                data["multiple"] = true
            }
            else {
                data["single"] = true;
            }

            messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);
            return;
        }
        // Lets put something on them! Check each item until we get to the end. If we find one, then escape the loop
        else {
            let equippeditem = false;
            let didswap = false;
            let itemcheck;
            for(let i = 0; i < dp.items.length; i++) {
                itemcheck = getItemType(dp.items[i]);
                let isworn = false;
                switch(itemcheck) {
                    case "wearable":
                        isworn = (getWearable(serverID, userID)?.includes(dp.items[i]));
                        break;
                    case "chastity":
                        isworn = (getChastity(serverID, userID)?.chastitytype == dp.items[i]);
                        break;
                    case "chastitybra":
                        isworn = (getChastityBra(serverID, userID)?.chastitytype == dp.items[i]);
                        break;
                    case "collar":
                        isworn = (getCollar(serverID, userID)?.collartype == dp.items[i]);
                        break;
                    case "gag":
                        isworn = (getGags(serverID, userID)?.find((g) => g.gagtype == dp.items[i]));
                        break;
                    case "mitten":
                        isworn = (getMitten(serverID, userID)?.mittenname == dp.items[i]);
                        break;
                    case "corset":
                        isworn = (getCorset(serverID, userID)?.type == dp.items[i]);
                        break;
                    case "heavy":
                        isworn = (getHeavyList(serverID, userID)?.find((h) => h.type == dp.items[i]));
                        break;
                    case "mask":
                        isworn = (getHeadwear(serverID, userID)?.includes(dp.items[i]));
                        break;
                    // assignToy needs a force param to be accurately handled in an outfit. As such this is disabled for now. 
                    /*
                    case "toy":
                        isworn = (getToys(serverID, userID)?.find((t) => t.type == dp.items[i].name));
                        break;*/
                    default:
                        console.log(`Unknown item type - ${dp.items[i]}`)
                        break;
                }
                // Now equip it if we aren't wearing it!
                if (!isworn) {
                    switch(itemcheck) {
                        case "wearable":
                            assignWearable(serverID, userID, dp.items[i]);
                            equippeditem = true;
                            break;
                        case "chastity":
                            let existingchastity = getChastity(serverID, userID)
                            if (existingchastity) { didswap = true }
                            assignChastity(serverID, userID, existingchastity?.keyholder ?? dp.keyholder ?? userID, dp.items[i], true);
                            equippeditem = true;
                            break;
                        case "chastitybra":
                            let existingchastity = getChastityBra(serverID, userID)
                            if (existingchastity) { didswap = true }
                            assignChastityBra(serverID, userID, existingchastity?.keyholder ?? dp.keyholder ?? userID, dp.items[i], true);
                            equippeditem = true;
                            break;
                        case "collar":
                            let existingcollar = getCollar(serverID, userID)
                            let perms = {};
                            if (existingcollar) { 
                                didswap = true 
                                perms = { chastity: existingcollar?.chastity, heavy: existingcollar?.heavy, mitten: existingcollar?.mitten, mask: existingcollar?.mask }
                            }
                            assignCollar(serverID, userID, existingcollar?.keyholder ?? dp.keyholder ?? userID, oerms, true, dp.items[i]);
                            equippeditem = true;
                            break;
                        case "gag":
                            assignGag(serverID, userID, dp.items[i], 5, dp.keyholder ?? userID);
                            equippeditem = true;
                            break;
                        case "mitten":
                            let existingmitten = getMitten(serverID, userID)
                            if (existingmitten) { didswap = true }
                            assignMitten(serverID, userID, dp.items[i], existingmitten?.origbinder ?? dp.keyholder ?? userID);
                            equippeditem = true;
                            break;
                        case "corset":
                            let existingcorset = getCorset(serverID, userID)
                            if (existingcorset) { didswap = true }
                            assignCorset(serverID, userID, dp.items[i], 5, existingcorset?.origbinder ?? dp.keyholder ?? userID);
                            equippeditem = true;
                            break;
                        case "heavy":
                            // This currently cannot accurately handle heavy bondage with custom name functions.
                            // Probably wont come up for a while, but if it does, we need to rewrite this for async.
                            // Ew. 
                            assignHeavy(serverID, userID, dp.items[i], dp.keyholder ?? userID);
                            equippeditem = true;
                            break;
                        case "mask":
                            assignHeadwear(serverID, userID, dp.items[i], dp.keyholder ?? userID);
                            equippeditem = true;
                            break;
                        // assignToy needs a force param to be accurately handled in an outfit. As such this is disabled for now. 
                        /*case "toy":
                            assignToy(serverID, userID, userID, dp.items[i].name, dp.keyholder ?? userID);
                            equippeditem = true;
                            break;*/
                        default:
                            itemcheck = "unknown"
                            break;
                    }
                    data.textdata.c2 = getItemName(dp.items[i])
                }

                // if we equipped something, break execution from for loop. 
                if (equippeditem) {
                    break;
                }
            }
            
            // If we successfully equipped something, notify the user
            if (equippeditem) {
                data["equip"] = true
                data[itemcheck] = true

                // If we modified the item in place or not
                if (didswap) {
                    data["replace"] = true
                }
                else {
                    data["add"] = true;
                }
            }
            else {
                data["endstage"] = true;
                dp.stage++;
            }

            messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);
            return;
        }
    }

    // If the stage is 3 or higher, we're ready to move until removal. 
    // The dress protocol event should check the stage and handle outside of this function's scope. This needs to eventually remove the device.
    if (dp.stage >= 3) { 
        messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);
        dp.stage++;
        return;
    }
}

exports.handleDressProtocol = handleDressProtocol;