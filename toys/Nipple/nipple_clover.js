// Nipple clamps with a clover pinch effect, providing a sharp diminishing arousal increase for five minutes as it "primes"
// Once the blood has been pinched out of the nipple, then if the clamp is released, it will provide a similarly
// sharp pain with severe arousal gain. 
//
// This will function where the vibeeffect is multipled by ((300000 - amount of time worn) / 300000), with no arousal given at 0.0.

const { getUserVar } = require("../../functions/getters/config/getUserVar")
const { addArousal } = require("../../functions/setters/arousal/addArousal")
const { setUserVar } = require("../../functions/setters/config/setUserVar")

// On remove, this will grant 12x the vibe effect
exports.toyname = "Clover Clamps"

// Arousal gain per intensity for this vibe type
exports.vibescale = (data) => { return 1.0 }

exports.calcVibeEffect = function (data) {
    let delta = (300000 - (Date.now() - (getUserVar(data.serverID, data.userID, "cloverclamptime") ?? (Date.now()) - 1))) / 300000
    return ((delta > 0) ? (data.intensity * this.vibescale() * delta) : (data.intensity * this.vibescale() * 0.1))
}

exports.onEquip = (data) => { 
    addArousal(data.serverID, data.userID, data.intensity / 4) 
    setUserVar(data.serverID, data.userID, "cloverclamptime", Date.now())
};

exports.onUnequip = function (data) {
    let delta = Math.min((Date.now() - getUserVar(data.serverID, data.userID, "cloverclamptime")) / 300000, 1.0)
    addArousal(data.serverID, data.userID, 10 * (12 * delta * this.vibescale())) 
    setUserVar(data.serverID, data.userID, "cloverclamptime", undefined)
}