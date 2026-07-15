const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { addArousal } = require("../../functions/setters/arousal/addArousal");
const { setUserVar } = require("../../functions/setters/config/setUserVar");

// Stasis Prison
// Modelled after the unique in PoE. This belt restores arousal after letting go
// and increases the threshold required to let go in the future.
// This modifies the implementation slightly but should still return the same result.
exports.denialCoefficient = (data) => { return 5 * Math.pow(1.2, (getUserVar(data.serverID, data.userID, "chastitystasisprisonorgasms") ?? 0)) }

exports.onOrgasm = (data) => {
    addArousal(data.serverID, data.userID, data.prevArousal);
    let currentorgasms = getUserVar(data.serverID, data.userID, "chastitystasisprisonorgasms") ?? 0;
    currentorgasms++;
    setUserVar(data.serverID, data.userID, "chastitystasisprisonorgasms", currentorgasms);
}

exports.onUnequip = (data) => {
    setUserVar(data.serverID, data.userID, "chastitystasisprisonorgasms", 0)
}

// Name
exports.name = "Stasis Prison"

// Tags
exports.tags = ["chastity"]

exports.itemdescription = `The **Stasis Prison** is modelled after the similarly named unique item in Path of Exile. It will restore the user's arousal to what it was after each successful **/letgo.**`