const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { setUserVar } = require("../../functions/setters/config/setUserVar");


// This plug will vibrate when the wearer speaks, setting the vibe scale HIGH for it
exports.calcVibeEffect = function (data) { 
    return (getUserVar(data.serverID, data.userID, "motionplugtime") ? (data.intensity * 4) * this.vibescale() : data.intensity * this.vibescale() * 0.7)
}

exports.onUnequip = function (data) {
    setUserVar(data.serverID, data.userID, "motionplugtime", undefined);
}

exports.onEquip = function (data) {
    setUserVar(data.serverID, data.userID, "motionplugtime", undefined);
}

exports.toyname = "Motion Sensitive Plug"

exports.itemdescription = `The **Motion Sensitive Plug** will activate a vibration whenever the user speaks.`