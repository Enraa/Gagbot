const { getUserVar, setUserVar } = require("../../functions/usercontext")

// This vibrator will only function if getUserVar(userID, "headpatvibecharge") has any value
exports.vibescale = (data) => { 
    return (getUserVar(data.userID, "headpatvibecharge") ? 1.5 : 0.0);
} // Ranging between 0 and 2

exports.calcVibeEffect = function(data) { 
    return (getUserVar(data.userID, "headpatvibecharge") ? data.intensity * this.vibescale(data) : 0.0)
}

exports.onUnequip = (data) => {
    setUserVar(data.userID, "headpatvibecharge", undefined)
}

exports.onEquip = (data) => {
    setUserVar(data.userID, "headpatvibecharge", 0.0)
}

exports.toyname = "Headpat Capacitor Vibe"