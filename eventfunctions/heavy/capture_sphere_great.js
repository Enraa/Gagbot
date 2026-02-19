const { removeHeavy, getHeavy } = require("../../functions/heavyfunctions")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { getText } = require("../../functions/textfunctions")
const { getUserVar, setUserVar } = require("../../functions/usercontext.js")
const { getArousal } = require("../../functions/vibefunctions")
const { calculatecapture } = require("./capture_sphere.js") // reuse the calculation!

let functiontick = async (userID) => {
    if (process.userevents == undefined) { process.userevents = {} }
    if (process.userevents[userID] == undefined) { process.userevents[userID] = {} }
    if (process.userevents[userID].capturesphere == undefined) { 
        process.userevents[userID].capturesphere = { 
            capture: calculatecapture(userID, 1.5), 
            ballname: "Great Sphere",
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

exports.functiontick = functiontick;
exports.functiononremove = functiononremove;