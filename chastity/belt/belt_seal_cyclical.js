const { getArousal } = require("../../functions/getters/arousal/getArousal");
const { getChastity } = require("../../functions/getters/chastity/getChastity");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { addArousal } = require("../../functions/setters/arousal/addArousal");
const { clearArousal } = require("../../functions/setters/arousal/clearArousal");
const { setUserVar } = require("../../functions/setters/config/setUserVar");

// Seal of Cyclical Time
// This Seal resets the wearer to their initial state every 3 minutes
// No Increase to denial when worn
exports.denialCoefficient = (data) => { return 1 }

// Events
exports.onEquip = (data) => {
    // Configure base arousal value
    if (!getUserVar(data.serverID, data.userID, "base_arousal") || getUserVar(data.serverID, data.userID, "base_arousal") == undefined) setUserVar(data.serverID, data.userID, "base_arousal", getArousal(data.serverID, data.userID) ?? 0);
}

exports.onUnequip = (data) => {
    //  Add All Stored Arousal at once
    clearArousal(data.serverID, data.userID);
    addArousal(data.serverID, data.userID, getUserVar(data.serverID, data.userID, "base_arousal"));
    setUserVar(data.serverID, data.userID, "base_arousal", undefined);
}

// Tags
exports.tags = ["seal", "chastity"]
// Name
exports.name = "Seal of Cyclical Time"

exports.itemdescription = `The **Seal of Cyclical Time** will track the initial arousal level of the wearer, and revert their arousal back to that every 3 minutes.`