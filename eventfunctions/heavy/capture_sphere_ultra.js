const { getProcessVariable } = require("../../functions/getters/config/getProcessVariable.js")
const { setUserVar } = require("../../functions/setters/config/setUserVar")
const { calculatecapture, checkUserEventsForSpheres, doSphereTick } = require("./capture_sphere.js") // reuse the calculation!

let tick = async (serverID, userID, datain) => {
    checkUserEventsForSpheres(serverID, userID);
    doSphereTick(serverID, userID, "capture_sphere_ultra", 2.0);
}

// Called when the item is removed. Only implemented for heavy bondage presently.
// This should be used to clear any lingering data from above. 
let functiononremove = async (serverID, userID) => {
    setUserVar(serverID, userID, "captureSphereCaptured", undefined)
    delete getProcessVariable(serverID, userID, "userevents").capturesphere;
}

exports.tick = tick;
exports.functiononremove = functiononremove;