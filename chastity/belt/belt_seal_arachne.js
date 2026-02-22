const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { addArousal } = require("../../functions/vibefunctions")

// Seal of the Pleasurable Descent (Arachne's Kiss)
// This Seal gradually increases the wearer's sensitivity (growthCoefficient), and raises the min arousal level for every successful orgasm while wearing it~
exports.growthCoefficient = function(data) { 
    return Math.min(2 + ((Date.now() - getUserVar(data.userID, "arachne_kiss") ?? Date.now()) / 900000), 10)
}

// Set Min Arousal to be equal to Arachne Heat Value, and allow the cooldown period to shorten as Heat increases starting from 80% of default.
exports.minArousal = function(data) { return getUserVar(data.userID, "arachne_heat")}
exports.orgasmCooldown = function(data) { return 1 / 1 + ((getUserVar(data.userID, "arachne_heat"))/2) }

// No Increase to denial when worn
exports.denialCoefficient = (data) => { return 1 }

// Events
exports.onOrgasm = (data) => {
    setUserVar(data.userID, "arachne_heat", (getUserVar(data.userID, "arachne_heat")) + 1)
    addArousal(data.userID, (getUserVar(data.userID, "arachne_heat")));
}
exports.onFailedOrgasm = (data) => {
    // Add a small amount of arousal scaling with Growth Coefficient
    addArousal(data.userID, (0.5 * this.growthCoefficient(data)));
}
exports.onEquip = (data) => {
    // Configure initial variable values and 'Kiss' time
    if (!getUserVar(data.userID, "arachne_heat") || getUserVar(data.userID, "arachne_heat") == undefined) setUserVar(data.userID, "arachne_heat", 1);
    if (!getUserVar(data.userID, "arachne_kiss") || getUserVar(data.userID, "arachne_kiss") == undefined) setUserVar(data.userID, "arachne_kiss", Date.now());
}
exports.onUnequip = (data) => {
    setUserVar(data.userID, "arachne_heat", undefined);
    setUserVar(data.userID, "arachne_kiss", undefined);
}

// Tags
exports.tags = ["seal"]
// Name
exports.name = "Seal of the Pleasurable Descent"