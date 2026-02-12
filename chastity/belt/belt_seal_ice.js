const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getArousal, addArousal } = require("../../functions/vibefunctions")

// Seal of the Enduring Ice
// This Seal locks the user's max arousal at their current level + 5%, and decreases the growth coefficient along with increasing the decay rate. Also doubles the Orgasm Cooldown
exports.growthCoefficient = (data) => { return 0.5 }
exports.decayCoefficient = (data) => { return 0.1 }
exports.orgasmCooldown = (data) => { return 2 }
exports.denialCoefficient = (data) => { return 1 }

// Set Min Arousal to be equal to the base Arousal + 5% when equipped
exports.maxArousal = function(data) { return getUserVar(data.userID, "base_arousal") * 1.05}

// Events
exports.onOrgasm = (data) => {
    // Decrease Base Arousal as the ice refreezes
    setUserVar(data.userID, "base_arousal", getUserVar(data.userID, "base_arousal") * 0.5)
}
exports.onFailedOrgasm = (data) => {
    // Remove a small amount of arousal with each failed attempt
    addArousal(data.userID, -0.5);
}
exports.afterArousalChange = (data) => {
    // Gradually raise the arousal cap as the ice slowly melts
    if(getArousal(data.userID) > getUserVar(data.userID, "base_arousal")) setUserVar(data.userID, "base_arousal", getUserVar(data.userID, "base_arousal") * 1.001)
}
exports.onEquip = (data) => {
    // Configure base arousal value
    if (!getUserVar(data.userID, "base_arousal") || getUserVar(data.userID, "base_arousal") == undefined) setUserVar(data.userID, "base_arousal", getArousal(data.userID) ?? 5);
}
exports.onUnequip = (data) => {
    setUserVar(data.userID, "base_arousal", undefined);
}

// Tags
exports.tags = ["seal"]
// Name
exports.name = "Seal of the Enduring Ice"