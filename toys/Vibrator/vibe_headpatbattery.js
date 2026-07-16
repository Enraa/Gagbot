const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { setUserVar } = require("../../functions/setters/config/setUserVar");


// This vibrator will only function if getUserVar(userID, "headpatvibecharge") has any value
exports.vibescale = (data) => { 
    return (getUserVar(data.serverID, data.userID, "headpatvibecharge") ? 1.5 : 0.0);
} // Ranging between 0 and 2

exports.calcVibeEffect = function(data) { 
    return (getUserVar(data.serverID, data.userID, "headpatvibecharge") ? data.intensity * this.vibescale(data) : 0.0)
}

exports.onUnequip = (data) => {
    setUserVar(data.serverID, data.userID, "headpatvibecharge", undefined)
}

exports.onEquip = (data) => {
    setUserVar(data.serverID, data.userID, "headpatvibecharge", 0.0)
}

exports.toyname = "Headpat Capacitor Vibe"

exports.itemdescription = `The **Headpat Capacitor Vibe** will activate when receiving a headpat, providing a vibrating sensation that can stack up as the battery is charged. The current battery gauge can be displayed in **/inspect**.`