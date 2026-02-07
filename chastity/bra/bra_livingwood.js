const { getUserVar, setUserVar } = require("../../functions/usercontext")

// Livingwood Bra
// This bra has a higher growth coefficient. Notably however,
// it will increase it's minimum vibe to return the amount of failed orgasms
// or every 15 minutes, until the wearer successfully orgasms. 
//
// This code is copied from chastity/belt/belt_livingwood.js and should be reviewed. Commented out for now.

exports.growthCoefficient = (data) => { return 1 }
exports.decayCoefficient = (data) => { return 0.1 }
exports.minVibe = (data) => { 
    return Math.max(Math.min(Math.floor((Date.now() - (getUserVar(data.userID, "livingwoodbelt") ?? Date.now())) / 900000), 20), getUserVar(user, "livingwoodvibe")) 
}
// Note, we must use a regular function context to retrieve a this correctly. 
exports.onOrgasm = function(data) {
    setUserVar(data.userID, "livingwoodvibe", Math.max((this.minVibe() - 10), 0))
    setUserVar(data.userID, "livingwoodbelt", Date.now());
}
exports.onFailedOrgasm = function(data) {
    setUserVar(data.userID, "livingwoodvibe", Math.min((this.minVibe() + 1), 20));
}
exports.onEquip = (data) => {
    if (getUserVar(data.userID, "livingwoodvibe") == {}) setUserVar(data.userID, "livingwoodvibe", 0);
    if (getUserVar(data.userID, "livingwoodbelt") == {}) setUserVar(data.userID, "livingwoodbelt", Date.now());
}
exports.onUnequip = (data) => {
    // Check if user is wearing a Livingwood Belt otherwise Null Out Vars
    if (getChastity(data.userID).chastitytype.includes("Livingwood")) {
        setUserVar(data.userID, "livingwoodvibe", {});
        setUserVar(data.userID, "livingwoodbelt", {});
    }
}

// Name
exports.name = "Livingwood Bra"

exports.tags = ["living"]