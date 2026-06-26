const { getArousal } = require("../../functions/getters/arousal/getArousal")
const { getChastity } = require("../../functions/getters/chastity/getChastity")
const { getChastityBra } = require("../../functions/getters/chastity/getChastityBra")
const { getChastityBraKeys } = require("../../functions/getters/chastity/getChastityBraKeys")
const { getChastityKeys } = require("../../functions/getters/chastity/getChastityKeys")
const { getClonedChastityBraKeysOwned } = require("../../functions/getters/chastity/getClonedChastityBraKeysOwned")
const { getClonedChastityKeysOwned } = require("../../functions/getters/chastity/getClonedChastityKeysOwned")
const { getClonedCollarKeysOwned } = require("../../functions/getters/collar/getClonedCollarKeysOwned")
const { getCollar } = require("../../functions/getters/collar/getCollar")
const { getCollarKeys } = require("../../functions/getters/collar/getCollarKeys")
const { getProcessVariable } = require("../../functions/getters/config/getProcessVariable")
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel")
const { getUserVar } = require("../../functions/getters/config/getUserVar")
const { getCorset } = require("../../functions/getters/corset/getCorset")
const { getGag } = require("../../functions/getters/gag/getGag")
const { getHeadwearRestrictions } = require("../../functions/getters/headwear/getHeadwearRestrictions")
const { getHeavy } = require("../../functions/getters/heavy/getHeavy")
const { getMitten } = require("../../functions/getters/mitten/getMitten")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { setProcessVariable } = require("../../functions/setters/config/setProcessVariable")
const { setUserVar } = require("../../functions/setters/config/setUserVar")
const { removeHeavy } = require("../../functions/setters/heavy/removeHeavy")
const { getText } = require("../../functions/textfunctions")

// Inputs a capture strength and params, outputs an array of 3 values depending on catch. 
// This heavy is all calculated in one go at the beginning of the function
// Implements catch formula described here: https://bulbapedia.bulbagarden.net/wiki/Catch_rate#Capture_method_(Generation_V)
function calculatecapture(serverID, userid, ballbonusnum = 1.0) {
    // The user's "health" will be based off of 50 arousal.
    let maxhealth = 50
    let currhealth = Math.max(50 - getArousal(serverID, userid), 0.5) // Always clamp to 0.5 hp left - false swipe range if you will. 
    let darkgrass = 1 // Not used, but formula has this, so we'll add it

    // Catch rate will be a base of 150, minus 10 for each held key, down to 3 (the catch rate for Articuno!)
    let heldkeysnum = [...getClonedChastityBraKeysOwned(serverID, userid), ...getClonedChastityKeysOwned(serverID, userid), ...getClonedCollarKeysOwned(serverID, userid),
                    ...getChastityKeys(serverID, userid), ...getChastityBraKeys(serverID, userid), ...getCollarKeys(serverID, userid)]
    console.log(`${userid} Catchrate: ${Math.max(150 - (heldkeysnum.length * 10), 3)}`)
    let catchrate = Math.max(150 - (heldkeysnum.length * 10), 3)
    let ballbonus = ballbonusnum;
    console.log(`Ball Bonus Multiplier: ${ballbonus}`)

    // Bonus if the target is bound!
    let statusbonus = 1;
    if (getMitten(serverID, userid) || !getHeadwearRestrictions(serverID, userid).canInspect || getCorset(serverID, userid)) {
        statusbonus = 2.5;
    }
    else if (getGag(serverID, userid) || getChastity(serverID, userid) || getChastityBra(serverID, userid) || getCollar(serverID, userid)) {
        statusbonus = 1.5;
    }
    console.log(`Status Multiplier: ${statusbonus}`)

    // Set array for catches
    let catches = [];

    // Calculate hp part first.
    let hpnum = ((3 * maxhealth) - (2 * currhealth)) / (3 * maxhealth)
    console.log(`HP Multiplier: ${hpnum}`)

    // Now the rest of the catchrate
    let modifiedcatchrate = hpnum * 4096 * darkgrass * catchrate * ballbonus * statusbonus;
    console.log(`Modified Catch Rate: ${modifiedcatchrate}`);

    // If the modifiedcatchrate is higher than 1044480, then we can just return set of 3 trues, as this is guaranteed catch
    if (modifiedcatchrate >= 1044480) { 
        console.log(`Guaranteed Capture! ${modifiedcatchrate} higher than 1044480!`)
        return [true, true, true] 
    }
    
    // Otherwise, we need to calculate shakes. We'll do 3 shakes. 
    else {
        let brokenfree = false;
        let shake_b = Math.floor(65536 * Math.pow((modifiedcatchrate / 1044480), 1 / 4)); // fourth root
        console.log(shake_b);
        console.log(`Chance to capture: ${Math.floor(Math.pow(shake_b / 65535, 3) * 100)}%`)
        for (let i = 0; i < 3; i++) {
            // Random number
            let randomnum = Math.floor(Math.random() * 65535)
            if ((randomnum < shake_b) && !brokenfree) {
                catches.push(true)
            }
            else {
                catches.push(false);
                brokenfree = true;
            }
        }
        console.log(`Result: ${catches[0]}, ${catches[1]}, ${catches[2]}`)
    }

    return catches;
}

let tick = async (serverID, userID, datain) => {
    if (getProcessVariable(serverID, userID, "userevents") == undefined) {
        setProcessVariable(serverID, userID, "userevents", {});
    }
    if (getProcessVariable(serverID, userID, "userevents").capturesphere == undefined) {
        getProcessVariable(serverID, userID, "userevents").capturesphere = { 
            capture: calculatecapture(serverID, userID, 1.0), 
            ballname: "Capture Sphere",
            captureprogress: -1,
            nextupdate: Date.now() + 2000
        } 
    }
    // If the last update was over 2 minutes ago, this was probably an orphaned ball. 
    if ((getProcessVariable(serverID, userID, "userevents").capturesphere.nextupdate + 120000 ?? 0) < Date.now()) {
        delete getProcessVariable(serverID, userID, "userevents").capturesphere
        return;
    }
    // Only update every 5 seconds
    if ((getProcessVariable(serverID, userID, "userevents").capturesphere.nextupdate ?? 0) < Date.now()) {
        getProcessVariable(serverID, userID, "userevents").capturesphere.nextupdate = Date.now() + 2000;
    }
    else { return };

    // get the user object, if it doesn't exist, go away
    let userobject = await process.client.users.fetch(userID); // The person that's been captured!
    let targetobject = await process.client.users.fetch(getHeavy(serverID, userID).origbinder ?? userID); // The cruel person who threw the pokeball!
    // Something's wrong. 
    if (!userobject || !targetobject || !getRecentChannel(serverID, userID).valid || getUserVar(serverID, userID, "captureSphereCaptured")) {
        return;
    }
    // Build data tree:
    let data = {
        textarray: "texts_eventfunctions",
        textdata: {
            interactionuser: userobject,
            targetuser: targetobject,
            c1: getProcessVariable(serverID, userID, "userevents").capturesphere.ballname
        }
    }
    data.heavy = true;
    data.capturesphere = true;

    // -1 to force an initial delay after equipping the sphere. 
    if (getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress == -1) {
        getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress++;
        return;
    }
    else if (getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress < 2) {
        if (getProcessVariable(serverID, userID, "userevents").capturesphere.capture) {
            if (getProcessVariable(serverID, userID, "userevents").capturesphere.capture[getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress]) {
                // Successful wiggle!
                messageSendChannel(`*wiggle...*`, getRecentChannel(serverID, userID).channelid);
            }
            else {
                data[`wigglefail${getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress}`] = true
                messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid)
                removeHeavy(serverID, userID, "capture_sphere");
                return;
            }
        }
        getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress++;
        return;
    }
    // Last wiggle! Note, if the third check fails, we still wiggle for it and then break free on captureprogress 3.
    // Yes this could have been an if/else clause above, but this was broken down here for readability. 
    else if (getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress == 2) {
        if (getProcessVariable(serverID, userID, "userevents").capturesphere.capture) {
            if (getProcessVariable(serverID, userID, "userevents").capturesphere.capture[getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress]) {
                messageSendChannel(`*wiggle...*`, getRecentChannel(serverID, userID).channelid);
            }
            else {
                messageSendChannel(`*wiggle...*`, getRecentChannel(serverID, userID).channelid)
            }
        }
        getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress++
        return;
    }
    else if (getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress == 3) {
        if (getProcessVariable(serverID, userID, "userevents").capturesphere.capture) {
            if (getProcessVariable(serverID, userID, "userevents").capturesphere.capture[getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress - 1]) {
                // This was a successful capture! 
                if (userobject.id == targetobject.id) {
                    data.capturesuccess_self = true
                }
                else {
                    data.capturesuccess_other = true
                }
                messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);
            }
            else {
                // This broke free on the third wiggle. 
                data.wigglefail2 = true;
                messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);
                removeHeavy(serverID, userID, "capture_sphere");
                return;
            }
        }
        getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress++
        return;
    }
    else if (getProcessVariable(serverID, userID, "userevents").capturesphere.captureprogress == 4) {
        setUserVar(serverID, userID, "captureSphereCaptured", true)
    }
}

// Called when the item is removed. Only implemented for heavy bondage presently.
// This should be used to clear any lingering data from above. 
let functiononremove = async (serverID, userID) => {
    setUserVar(serverID, userID, "captureSphereCaptured", undefined)
    delete getProcessVariable(serverID, userID, "userevents").capturesphere;
}

exports.calculatecapture = calculatecapture;
exports.tick = tick;
exports.functiononremove = functiononremove;