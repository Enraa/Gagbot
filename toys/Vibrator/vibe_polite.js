const { getUserVar, setUserVar } = require("../../functions/usercontext")

// This vibrator will only function if getUserVar(userID, "politeSubVibeTime") has any value
exports.vibescale = (data) => { return 3.0 } // Not a mistake. Very arousing to be compliant!

exports.calcVibeEffect = function (data) { 
    return (getUserVar(data.userID, "politeSubVibeTime") ? data.intensity * this.vibescale() : 0)
}

exports.onUnequip = function (data) {
    setUserVar(data.userID, "politeSubVibeTime", null);
}

exports.onEquip = function (data) {
    setUserVar(data.userID, "politeSubVibeTime", null);
}

exports.toyname = "Polite Vibe"