const { getProcessVariable } = require("../../functions/getters/config/getProcessVariable.js")
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel.js")
const { getUserVar } = require("../../functions/getters/config/getUserVar")
const { getHeavy } = require("../../functions/getters/heavy/getHeavy")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { setProcessVariable } = require("../../functions/setters/config/setProcessVariable.js")
const { setUserVar } = require("../../functions/setters/config/setUserVar")
const { removeHeavy } = require("../../functions/setters/heavy/removeHeavy")
const { getText } = require("../../functions/textfunctions")
const { calculatecapture } = require("./capture_sphere.js") // reuse the calculation!

let tick = async (serverID, userID, datain) => {
    checkUserEventsForSpheres(serverID, userID);
    await doSphereTick(serverID, userID, "capture_sphere_master", 10000.0);
}

// Called when the item is removed. Only implemented for heavy bondage presently.
// This should be used to clear any lingering data from above. 
let functiononremove = async (serverID, userID) => {
    setUserVar(serverID, userID, "captureSphereCaptured", undefined)
    delete getProcessVariable(serverID, userID, "userevents").capturesphere;
}

exports.tick = tick;
exports.functiononremove = functiononremove;