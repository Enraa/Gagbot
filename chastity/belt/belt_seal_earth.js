const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getArousal, addArousal } = require("../../functions/vibefunctions")

// Seal of the Unmoving Stone
// This Seal locks the user's arousal to within a small range of their current level. The Range shifts gradually as they remain above or below the median. Also doubles the Orgasm Cooldown
exports.growthCoefficient = (data) => { return 1 }
exports.decayCoefficient = (data) => { return 1 }
exports.orgasmCooldown = (data) => { return 2 }
exports.denialCoefficient = (data) => { return 1 }

// Set Min Arousal to be equal to the base Arousal + 5% when equipped
exports.minArousal = function(data) { return getUserVar(data.userID, "base_arousal") * 0.90}
exports.maxArousal = function(data) { return getUserVar(data.userID, "base_arousal") * 1.10}

// Events
exports.onOrgasm = (data) => {
    // Maintain Arousal level and Increase Base Arousal to raise cap as the 'rock' jolts slightly forwards
    addArousal(data.userID, getUserVar(data.userID, "base_arousal"));
    setUserVar(data.userID, "base_arousal", getUserVar(data.userID, "base_arousal") * 1.1)
    console.log(getUserVar(data.userID, "base_arousal"))
}
exports.afterArousalChange = (data) => {
    // Earth only allows slow shifts in the arousal values regardless of vibe strength
    if(getArousal(data.userID) > getUserVar(data.userID, "base_arousal")) setUserVar(data.userID, "base_arousal", Math.max(getUserVar(data.userID, "base_arousal") * 1.02, getUserVar(data.userID, "base_arousal") + 0.01))
    else if(getArousal(data.userID) < getUserVar(data.userID, "base_arousal")) setUserVar(data.userID, "base_arousal", Math.max(Math.min(getUserVar(data.userID, "base_arousal") * 0.98, getUserVar(data.userID, "base_arousal") - 0.01), 0))
}
exports.onEquip = (data) => {
    // Configure base arousal value
    if (!getUserVar(data.userID, "base_arousal") || getUserVar(data.userID, "base_arousal") == undefined) setUserVar(data.userID, "base_arousal", getArousal(data.userID));
}
exports.onUnequip = (data) => {
    setUserVar(data.userID, "base_arousal", undefined);
}

// Tags
exports.tags = ["seal"]
// Name
exports.name = "Seal of the Unmoving Stone"