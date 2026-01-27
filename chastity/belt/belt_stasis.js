const { getUserVar, setUserVar } = require("../../functions/usercontext");
const { addArousal } = require("../../functions/vibefunctions")

// Stasis Prison
// Modelled after the unique in PoE. This belt restores arousal after letting go
// and increases the threshold required to let go in the future.
// This modifies the implementation slightly but should still return the same result.
exports.denialCoefficient = (data) => { return 5 * Math.pow(1.2, (getUserVar(data.userID, "chastitystasisprisonorgasms") ?? 0)) }

exports.onOrgasm = (data) => {
    addArousal(data.userID, data.prevArousal);
    let currentorgasms = getUserVar(data.userID, "chastitystasisprisonorgasms") ?? 0;
    currentorgasms++;
    setUserVar(data.userID, "chastitystasisprisonorgasms", currentorgasms);
}

exports.onUnequip = (data) => {
    setUserVar(data.userID, "chastitystasisprisonorgasms", 0)
}

// Name
exports.name = "Stasis Prison"