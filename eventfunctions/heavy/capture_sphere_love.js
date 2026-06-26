const { getChastity } = require("../../functions/getters/chastity/getChastity")
const { getChastityBra } = require("../../functions/getters/chastity/getChastityBra")
const { getClonedChastityBraKey } = require("../../functions/getters/chastity/getClonedChastityBraKey")
const { getClonedChastityKey } = require("../../functions/getters/chastity/getClonedChastityKey")
const { getClonedCollarKey } = require("../../functions/getters/collar/getClonedCollarKey")
const { getCollar } = require("../../functions/getters/collar/getCollar")
const { getProcessVariable } = require("../../functions/getters/config/getProcessVariable.js")
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel.js")
const { getUserVar } = require("../../functions/getters/config/getUserVar")
const { getHeavy } = require("../../functions/getters/heavy/getHeavy")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { setUserVar } = require("../../functions/setters/config/setUserVar")
const { removeHeavy } = require("../../functions/setters/heavy/removeHeavy")
const { getText } = require("../../functions/textfunctions")
const { calculatecapture } = require("./capture_sphere.js") // reuse the calculation!

let tick = async (serverID, userID, datain) => {
    if (getProcessVariable(serverID, userID, "userevents") == undefined) {
        setProcessVariable(serverID, userID, "userevents", {});
    }
    if (getProcessVariable(serverID, userID, "userevents").capturesphere == undefined) {
        let capturerate = 1.0;
        let origbinder = getHeavy(userID)?.origbinder ?? 0;
        // If the person who bound this person has a key to the target, do the original
        // love sphere effect. Not doing gender shenanigans. Too gay for that.
        // Only apply this if they did NOT capture themselves with it lol 
        if (origbinder != userID) {
            if (getChastity(userID)?.keyholder == origbinder) { capturerate = 8.0 }
            if (getChastityBra(userID)?.keyholder == origbinder) { capturerate = 8.0 }
            if (getCollar(userID)?.keyholder == origbinder) { capturerate = 8.0 }
            if (getClonedChastityKey(userID).includes(origbinder)) { capturerate = 8.0 }
            if (getClonedChastityBraKey(userID).includes(origbinder)) { capturerate = 8.0 }
            if (getClonedCollarKey(userID).includes(origbinder)) { capturerate = 8.0 }
        }
        getProcessVariable(serverID, userID, "userevents").capturesphere = { 
            capture: calculatecapture(serverID, userID, capturerate), 
            ballname: "Love Sphere",
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

exports.tick = tick;
exports.functiononremove = functiononremove;