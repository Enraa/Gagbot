const { getClonedCollarKeysOwned, getCollarKeys, getCollar } = require("../../functions/collarfunctions")
const { getCorset } = require("../../functions/corsetfunctions")
const { getGag, getMitten } = require("../../functions/gagfunctions")
const { getHeadwearRestrictions } = require("../../functions/headwearfunctions")
const { removeHeavy, getHeavy } = require("../../functions/heavyfunctions")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { getText } = require("../../functions/textfunctions")
const { setUserVar, getUserVar } = require("../../functions/usercontext")
const { getClonedChastityKeysOwned, getChastityKeys, getChastity } = require("../../functions/vibefunctions")
const { getChastityBra } = require("../../functions/vibefunctions")
const { getChastityBraKeys } = require("../../functions/vibefunctions")
const { getClonedChastityBraKeysOwned } = require("../../functions/vibefunctions")
const { getArousal } = require("../../functions/vibefunctions")

// Inputs a capture strength and params, outputs an array of 3 values depending on catch. 
// This heavy is all calculated in one go at the beginning of the function
// Implements catch formula described here: https://bulbapedia.bulbagarden.net/wiki/Catch_rate#Capture_method_(Generation_V)
function calculatecapture(userid, ballbonusnum = 1.0) {
    // The user's "health" will be based off of 50 arousal.
    let maxhealth = 50
    let currhealth = Math.min(getArousal(userid), 49.5) // Always clamp to 0.5 hp left - false swipe range if you will. 
    let darkgrass = 1 // Not used, but formula has this, so we'll add it

    // Catch rate will be a base of 150, minus 10 for each held key, down to 3 (the catch rate for Articuno!)
    let heldkeysnum = [...getClonedChastityBraKeysOwned(userid), ...getClonedChastityKeysOwned(userid), ...getClonedCollarKeysOwned(userid),
                    ...getChastityKeys(userid), ...getChastityBraKeys(userid), ...getCollarKeys(userid)].length
    let catchrate = Math.max(150 - (heldkeysnum * 10), 3)
    let ballbonus = ballbonusnum;

    // Bonus if the target is bound!
    let statusbonus = 1;
    if (getMitten(userid) || !getHeadwearRestrictions(userid).canInspect || getCorset(userid)) {
        statusbonus = 2.5;
    }
    else if (getGag(userid) || getChastity(userid) || getChastityBra(userid) || getCollar(userid)) {
        statusbonus = 1.5;
    }

    // Set array for catches
    let catches = [];

    // Calculate hp part first.
    let hpnum = ((3 * maxhealth) - (2 * currhealth)) / (3 * maxhealth)

    // Now the rest of the catchrate
    let modifiedcatchrate = hpnum * 4096 * darkgrass * catchrate * ballbonus * statusbonus;

    // If the modifiedcatchrate is higher than 1044480, then we can just return set of 3 trues, as this is guaranteed catch
    if (modifiedcatchrate >= 1044480) { return [true, true, true] }
    
    // Otherwise, we need to calculate shakes. We'll do 3 shakes. 
    else {
        let brokenfree = false;
        let shake_b = Math.floor(65536 / Math.sqrt(Math.sqrt(16711680 / modifiedcatchrate))); // fourth root
        for (let i = 0; i < 3; i++) {
            // Random number
            let randomnum = Math.floor(Math.random() * 65535)
            if ((randomnum >= shake_b) && !brokenfree) {
                catches.push(true)
            }
            else {
                catches.push(false);
                brokenfree = true;
            }
        }
    }

    return catches;
}

let functiontick = async (userID) => {
    if (process.userevents == undefined) { process.userevents = {} }
    if (process.userevents[userID] == undefined) { process.userevents[userID] = {} }
    if (process.userevents[userID].capturesphere == undefined) { 
        process.userevents[userID].capturesphere = { 
            capture: calculatecapture(userID, 1.0), 
            ballname: "Capture Sphere",
            captureprogress: -1,
            nextupdate: Date.now() + 2000
        } 
    }
    // If the last update was over 2 minutes ago, this was probably an orphaned ball. 
    if ((process.userevents[userID].capturesphere.nextupdate + 120000 ?? 0) < Date.now()) {
        delete process.userevents[userID].capturesphere
        return;
    }
    // Only update every 5 seconds
    if ((process.userevents[userID].capturesphere.nextupdate ?? 0) < Date.now()) {
        process.userevents[userID].capturesphere.nextupdate = Date.now() + 2000;
    }
    else { return };

    // get the user object, if it doesn't exist, go away
    let userobject = await process.client.users.fetch(userID); // The person that's been captured!
    let targetobject = await process.client.users.fetch(getHeavy(userID).origbinder ?? userID); // The cruel person who threw the pokeball!
    // Something's wrong. 
    if (!userobject || !targetobject || !(process.recentmessages && process.recentmessages[userID]) || getUserVar(userID, "catureSphereCaptured")) {
        return;
    }
    // Build data tree:
    let data = {
        textarray: "texts_eventfunctions",
        textdata: {
            interactionuser: userobject,
            targetuser: targetobject,
            c1: process.userevents[userID].capturesphere.ballname
        }
    }
    data.heavy = true;
    data.capturesphere = true;

    // -1 to force an initial delay after equipping the sphere. 
    if (process.userevents[userID].capturesphere.captureprogress == -1) {
        process.userevents[userID].capturesphere.captureprogress++;
        return;
    }
    else if (process.userevents[userID].capturesphere.captureprogress < 2) {
        if (process.userevents[userID].capturesphere.capture) {
            if (process.userevents[userID].capturesphere.capture[process.userevents[userID].capturesphere.captureprogress]) {
                // Successful wiggle!
                messageSendChannel(`*wiggle...*`, process.recentmessages[userID]);
            }
            else {
                data[`wigglefail${process.userevents[userID].capturesphere.captureprogress}`] = true
                messageSendChannel(getText(data), process.recentmessages[userID])
                removeHeavy(userID);
                return;
            }
        }
        process.userevents[userID].capturesphere.captureprogress++;
        return;
    }
    // Last wiggle! Note, if the third check fails, we still wiggle for it and then break free on captureprogress 3.
    // Yes this could have been an if/else clause above, but this was broken down here for readability. 
    else if (process.userevents[userID].capturesphere.captureprogress == 2) {
        if (process.userevents[userID].capturesphere.capture) {
            if (process.userevents[userID].capturesphere.capture[process.userevents[userID].capturesphere.captureprogress]) {
                messageSendChannel(`*wiggle...*`, process.recentmessages[userID]);
            }
            else {
                messageSendChannel(`*wiggle...*`, process.recentmessages[userID])
            }
        }
        process.userevents[userID].capturesphere.captureprogress++
        return;
    }
    else if (process.userevents[userID].capturesphere.captureprogress == 3) {
        if (process.userevents[userID].capturesphere.capture) {
            if (process.userevents[userID].capturesphere.capture[process.userevents[userID].capturesphere.captureprogress - 1]) {
                // This was a successful capture! 
                if (userobject.id == targetobject.id) {
                    data.capturesuccess_self = true
                }
                else {
                    data.capturesuccess_other = true
                }
                messageSendChannel(getText(data), process.recentmessages[userID]);
            }
            else {
                // This broke free on the third wiggle. 
                data.wigglefail2 = true;
                messageSendChannel(getText(data), process.recentmessages[userID]);
                removeHeavy(userID);
                return;
            }
        }
        process.userevents[userID].capturesphere.captureprogress++
        return;
    }
    else if (process.userevents[userID].capturesphere.captureprogress == 4) {
        setUserVar(userID, "captureSphereCaptured", true)
    }
}

// Called when the item is removed. Only implemented for heavy bondage presently.
// This should be used to clear any lingering data from above. 
let functiononremove = async (userID) => {
    setUserVar(userID, "captureSphereCaptured", undefined)
    delete process.userevents[userID].capturesphere;
}

exports.calculatecapture = calculatecapture;
exports.functiontick = functiontick;
exports.functiononremove = functiononremove;