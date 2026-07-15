const { getArousal } = require("../../functions/getters/arousal/getArousal")
const { getUserVar } = require("../../functions/getters/config/getUserVar")
const { addArousal } = require("../../functions/setters/arousal/addArousal")
const { setUserVar } = require("../../functions/setters/config/setUserVar")

// Seal of the Ardent Flame
// This Seal locks the user's min arousal at their current level, and increases the growth coefficient along with reducing the decay rate. Also halves the Orgasm Cooldown
exports.growthCoefficient = (data) => { return 3 }
exports.decayCoefficient = (data) => { return 0.6 }
exports.orgasmCooldown = (data) => { return 0.5 }
exports.denialCoefficient = (data) => { return 1 }

// Set Min Arousal to be equal to the initial Arousal when equipped
exports.minArousal = function(data) { return getUserVar(data.serverID, data.userID, "base_arousal") }

// Events
exports.onOrgasm = (data) => {
    // Reset Arousal to Base
    addArousal(data.serverID, data.userID, getUserVar(data.serverID, data.userID, "base_arousal"));
}
exports.onFailedOrgasm = (data) => {
    // Add a small amount of arousal with each failed attempt
    addArousal(data.serverID, data.userID, 2 * Math.random());
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
exports.name = "Seal of the Ardent Flame"

exports.itemdescription = `The **Seal of the Ardent Flame** will lock the user's arousal at the current level and reduce the cooldown after a successful **/letgo**.`