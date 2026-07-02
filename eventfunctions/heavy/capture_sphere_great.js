const { getProcessVariable } = require("../../functions/getters/config/getProcessVariable.js");
const { setProcessVariable } = require("../../functions/setters/config/setProcessVariable.js");
const { setUserVar } = require("../../functions/setters/config/setUserVar")
const { calculatecapture, doSphereTick } = require("./capture_sphere.js") // reuse the calculation!

let tick = async (serverID, userID, datain) => {
    if (getProcessVariable(serverID, userID, "userevents") == undefined) {
        setProcessVariable(serverID, userID, "userevents", {});
    }
    await doSphereTick(serverID, userID, "capture_sphere_great", 1.5);
}

// Called when the item is removed. Only implemented for heavy bondage presently.
// This should be used to clear any lingering data from above. 
let functiononremove = async (serverID, userID) => {
    setUserVar(serverID, userID, "captureSphereCaptured", undefined)
    delete getProcessVariable(serverID, userID, "userevents").capturesphere;
}


exports.tick = tick;
exports.functiononremove = functiononremove;