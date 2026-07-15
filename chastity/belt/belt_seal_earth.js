const { getArousal } = require("../../functions/getters/arousal/getArousal")
const { getUserVar } = require("../../functions/getters/config/getUserVar")
const { addArousal } = require("../../functions/setters/arousal/addArousal")
const { setUserVar } = require("../../functions/setters/config/setUserVar")

// Seal of the Unmoving Stone
// This Seal locks the user's arousal to within a small range of their current level. The Range shifts gradually as they remain above or below the median. Also doubles the Orgasm Cooldown
exports.growthCoefficient = (data) => { return 1 }
exports.decayCoefficient = (data) => { return 1 }
exports.orgasmCooldown = (data) => { return 2 }
exports.denialCoefficient = (data) => { return 1 }

// Set Min Arousal to be equal to the base Arousal + 5% when equipped
exports.minArousal = function(data) { return getUserVar(data.serverID, data.userID, "base_arousal") * 0.90}
exports.maxArousal = function(data) { return getUserVar(data.serverID, data.userID, "base_arousal") * 1.10}

// Events
exports.onOrgasm = (data) => {
    // Maintain Arousal level and Increase Base Arousal to raise cap as the 'rock' jolts slightly forwards
    addArousal(data.serverID, data.userID, getUserVar(data.serverID, data.userID, "base_arousal"));
    setUserVar(data.serverID, data.userID, "base_arousal", getUserVar(data.serverID, data.userID, "base_arousal") * 1.1)
}
exports.afterArousalChange = (data) => {
    // Earth only allows slow shifts in the arousal values regardless of vibe strength
    if(getArousal(data.serverID, data.userID) > getUserVar(data.serverID, data.userID, "base_arousal")) setUserVar(data.serverID, data.userID, "base_arousal", Math.max(getUserVar(data.serverID, data.userID, "base_arousal") * 1.02, getUserVar(data.serverID, data.userID, "base_arousal") + 0.01))
    else if(getArousal(data.serverID, data.userID) < getUserVar(data.serverID, data.userID, "base_arousal")) setUserVar(data.serverID, data.userID, "base_arousal", Math.max(Math.min(getUserVar(data.serverID, data.userID, "base_arousal") * 0.98, getUserVar(data.serverID, data.userID, "base_arousal") - 0.01), 0))
}
exports.onEquip = (data) => {
    // Configure base arousal value
    if (!getUserVar(data.serverID, data.userID, "base_arousal") || getUserVar(data.serverID, data.userID, "base_arousal") == undefined) setUserVar(data.serverID, data.userID, "base_arousal", getArousal(data.serverID, data.userID));
}
exports.onUnequip = (data) => {
    setUserVar(data.serverID, data.userID, "base_arousal", undefined);
}

// Tags
exports.tags = ["seal", "chastity"]
// Name
exports.name = "Seal of the Unmoving Stone"

exports.itemdescription = `The **Seal of the Unmoving Stone** will make it difficult for the wearer's arousal to change over time, with a higher rate of change the more it drifts from the median.`