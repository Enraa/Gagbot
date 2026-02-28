const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { clearArousal, getArousal, addArousal } = require("../../functions/vibefunctions")

// Seal of Cyclical Time
// This Seal resets the wearer to their initial state every 3 minutes
// No Increase to denial when worn
exports.denialCoefficient = (data) => { return 1 }

// Events
// Randomly reduce the level of arousal by a random percentage, then reduce by a further 10%
exports.onEquip = (data) => {
    // Configure base arousal value
    if (!getUserVar(data.userID, "base_arousal") || getUserVar(data.userID, "base_arousal") == undefined) setUserVar(data.userID, "base_arousal", getArousal(data.userID) ?? 0);
    if (!getUserVar(data.userID, "stasis_timer") || getUserVar(data.userID, "stasis_timer") == undefined) setUserVar(data.userID, "stasis_timer", Date.now());
}

exports.onUnequip = (data) => {
    //  Add All Stored Arousal at once
    addArousal(data.userID, getUserVar(data.userID, "base_arousal"));
    setUserVar(data.userID, "base_arousal", undefined);
    setUserVar(data.userID, "stasis_timer", undefined);
}

// Tags
exports.tags = ["seal"]
// Name
exports.name = "Seal of Cyclical Time"