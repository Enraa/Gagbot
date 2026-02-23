const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getToys, getBaseToy } = require("../../functions/toyfunctions");
const { getArousal, addArousal } = require("../../functions/vibefunctions")

// Seal of False Calm
// This Seal locks arousal at 0, while tracking what the strongest vibe they are wearing is and storing an arousal value relative to that every minute that is applied on being unequipped
// No Increase to denial when worn
exports.denialCoefficient = (data) => { return 1 }
// Arousal locked to 0
exports.maxArousal = (data) => { return 0 }

// Events
// Randomly reduce the level of arousal by a random percentage, then reduce by a further 10%
exports.onEquip = (data) => {
    // Configure base arousal value
    if (!getUserVar(data.userID, "base_arousal") || getUserVar(data.userID, "base_arousal") == undefined) setUserVar(data.userID, "base_arousal", getArousal(data.userID) ?? 0);
}

exports.onUnequip = (data) => {
    //  Add All Stored Arousal at once
    addArousal(data.userID, getUserVar(data.userID, "base_arousal"));
    setUserVar(data.userID, "base_arousal", undefined);
}

// Tags
exports.tags = ["seal"]
// Name
exports.name = "Seal of False Calm"