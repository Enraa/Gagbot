const { getUserVar } = require("../../functions/getters/config/getUserVar")
const { getHeavyRestrictions } = require("../../functions/getters/heavy/getHeavyRestrictions")
const { getMitten } = require("../../functions/getters/mitten/getMitten")
const { setUserVar } = require("../../functions/setters/config/setUserVar")

// Nipple teasing that is only effective if the wearer is wearing mittens or heavy bondage!
// Will trigger a message when it changes to activate. 
exports.toyname = "Helpless Taunting Massagers"

// Arousal gain per intensity for this vibe type
exports.vibescale = (data) => { return 0.6 }

exports.calcVibeEffect = function (data) {
    return ((!getHeavyRestrictions(data.serverID, data.userID).touchself || getMitten(data.serverID, data.userID)) ? (data.intensity * this.vibescale()) : 0)
}

exports.onUnequip = function (data) {
    setUserVar(data.serverID, data.userID, "helplesslytaunted", undefined);
}

exports.onEquip = function (data) {
    setUserVar(data.serverID, data.userID, "helplesslytaunted", undefined);
}