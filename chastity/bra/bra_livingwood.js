const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getChastity } = require("../../functions/vibefunctions.js");

// Livingwood Bra
// This bra has a higher growth coefficient. Notably however,
// it will increase it's minimum vibe to return the amount of failed orgasms
// or every 15 minutes, until the wearer successfully orgasms. 
//
// This code is copied from chastity/belt/belt_livingwood.js and should be reviewed. Commented out for now.

exports.growthCoefficient = (data) => { return 1 }
exports.decayCoefficient = (data) => { return 0.1 }
// Never Fully Clear Arousal
exports.minArousal = (data) => { return 0.5 }
exports.minVibe = function(data) {
    return Math.max(Math.min(Math.floor((Date.now() - (getUserVar(data.userID, "livingwood_chastity") ?? Date.now())) / 900000), 20), getUserVar(data.userID, "livingwood_vibe"))
}
exports.onOrgasm = (data) =>  {
    setUserVar(data.userID, "livingwood_vibe", Math.max((this.minVibe(data) - 10), 0))
    setUserVar(data.userID, "livingwood_chastity", Date.now());
}
exports.onFailedOrgasm = (data) => {
    //console.log(this);
    setUserVar(data.userID, "livingwood_vibe", Math.min((this.minVibe(data) + 1), 20));
}
exports.onEquip = (data) => {
    if (!getUserVar(data.userID, "livingwood_vibe") || getUserVar(data.userID, "livingwood_vibe") == undefined) setUserVar(data.userID, "livingwood_vibe", 0);
    if (!getUserVar(data.userID, "livingwood_chastity") || getUserVar(data.userID, "livingwood_chastity") == undefined) setUserVar(data.userID, "livingwood_chastity", Date.now());
}
exports.onUnequip = (data) => {
    // Check if user is wearing a Livingwood Belt otherwise Null Out Vars
    if (!getChastity(data.userID)?.chastitytype != "belt_livingwood") {
        setUserVar(data.userID, "livingwood_vibe", undefined);
        setUserVar(data.userID, "livingwood_chastity", undefined);
    }
}

// Tags
exports.tags = ["living"]
// Name
exports.name = "Livingwood Bra"
