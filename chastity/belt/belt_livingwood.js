const { getChastityBra } = require("../../functions/getters/chastity/getChastityBra");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { setUserVar } = require("../../functions/setters/config/setUserVar");

// Livingwood Belt
// This belt has a higher growth coefficient. Notably however,
// it will increase it's minimum vibe to return the amount of failed orgasms
// or every 15 minutes, until the wearer successfully orgasms. 
exports.growthCoefficient = (data) => { return 1 }
exports.decayCoefficient = (data) => { return 0.1 }
// Never Fully Clear Arousal
exports.minArousal = (data) => { return 0.5 }
exports.minVibe = function(data) {
    return Math.max(Math.min(Math.floor((Date.now() - (getUserVar(data.serverID, data.userID, "livingwood_chastity") ?? Date.now())) / 900000), 20), getUserVar(data.serverID, data.userID, "livingwood_vibe"))
}
exports.onOrgasm = (data) => {
    setUserVar(data.serverID, data.userID, "livingwood_vibe", Math.max((this.minVibe(data) - 10), 0))
    setUserVar(data.serverID, data.userID, "livingwood_chastity", Date.now());
}
exports.onFailedOrgasm = (data) => {
    //console.log(this);
    setUserVar(data.serverID, data.userID, "livingwood_vibe", Math.min((this.minVibe(data) + 1), 20));
}
exports.onEquip = (data) => {
    if (!getUserVar(data.serverID, data.userID, "livingwood_vibe") || getUserVar(data.serverID, data.userID, "livingwood_vibe") == undefined) setUserVar(data.serverID, data.userID, "livingwood_vibe", 0);
    if (!getUserVar(data.serverID, data.userID, "livingwood_chastity") || getUserVar(data.serverID, data.userID, "livingwood_chastity") == undefined) setUserVar(data.serverID, data.userID, "livingwood_chastity", Date.now());
}
exports.onUnequip = (data) => {
    // Check if user is wearing a Livingwood Bra otherwise Null Out Vars
    if (getChastityBra(data.serverID, data.userID)?.chastitytype != "bra_livingwood") {
        setUserVar(data.serverID, data.userID, "livingwood_vibe", undefined);
        setUserVar(data.serverID, data.userID, "livingwood_chastity", undefined);
    }
}

// Tags
exports.tags = ["living", "chastity"]
// Name
exports.name = "Livingwood Belt"

exports.itemdescription = `The **Livingwood Belt** will progressively become harder to **/letgo** for each failed attempt, as well as for every 15 minutes without success.`