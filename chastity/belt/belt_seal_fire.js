const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getArousal, addArousal } = require("../../functions/vibefunctions")

// Seal of the Ardent Flame
// This Seal locks the user's min arousal at their current level, and increases the growth coefficient along with reducing the decay rate. Also halves the Orgasm Cooldown
exports.growthCoefficient = (data) => { return 3 }
exports.decayCoefficient = (data) => { return 0.6 }
exports.orgasmCooldown = (data) => { return 0.5 }
exports.denialCoefficient = (data) => { return 1 }

// Set Min Arousal to be equal to the initial Arousal when equipped
exports.minArousal = function(data) { return getUserVar(data.userID, "base_arousal") }

// Events
exports.onOrgasm = (data) => {
    // Reset Arousal to Base
    addArousal(data.userID, getUserVar(data.userID, "base_arousal"));
}
exports.onFailedOrgasm = (data) => {
    // Add a small amount of arousal with each failed attempt
    addArousal(data.userID, 2 * Math.random());
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
exports.name = "Seal of the Ardent Flame"