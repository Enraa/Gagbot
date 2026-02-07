const { getUserVar, setUserVar } = require("../../functions/usercontext")

// Livingwood Belt
// This belt has a higher growth coefficient. Notably however,
// it will increase it's minimum vibe to return the amount of failed orgasms
// or every 15 minutes, until the wearer successfully orgasms. 
exports.growthCoefficient = (data) => { return 1 }
exports.decayCoefficient = (data) => { return 0.1 }
exports.minVibe = (data) => {
    return Math.max(Math.min(Math.floor((Date.now() - (getUserVar(data.userID, "livingwoodbelt") ?? Date.now())) / 900000), 20), getUserVar(data.userID, "livingwoodvibe"))
}
// Note, we must use a regular function context to retrieve a this correctly. 
exports.onOrgasm = function (data) {
    setUserVar(data.userID, "livingwoodvibe", Math.max((this.minVibe(data) - 10), 0))
    setUserVar(data.userID, "livingwoodbelt", Date.now());
}
exports.onFailedOrgasm = function (data) {
    console.log(this);
    setUserVar(data.userID, "livingwoodvibe", Math.min((this.minVibe(data) + 1), 20));
}
exports.onEquip = (data) => {
    if (getUserVar(data.userID, "livingwoodvibe") == {}) setUserVar(data.userID, "livingwoodvibe", 0);
    if (getUserVar(data.userID, "livingwoodbelt") == {}) setUserVar(data.userID, "livingwoodbelt", Date.now());
}
exports.onUnequip = (data) => {
    // Check if user is wearing a Livingwood Bra otherwise Null Out Vars
    if (getChastityBra(data.userID).chastitytype.includes("Livingwood")) {
        setUserVar(data.userID, "livingwoodvibe", {});
        setUserVar(data.userID, "livingwoodbelt", {});
    }
}

exports.tags = ["living"]

// Name
exports.name = "Livingwood Belt"