const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { addArousal } = require("../../functions/vibefunctions")

// Seal of the Capricious Breeze
// This Seal randomly adds an amount of arousal between 0 and the Wearer's current value when orgasming
// No Increase to denial when worn
exports.denialCoefficient = (data) => { return 1 }
exports.growthCoefficient = (data) => { return 1.5 }
exports.decayCoefficient = (data) => { return 0.15 }

// Orgasm Cooldown randomised between 0 and 2x default 
exports.orgasmCooldown = (data) => { return 2 * Math.random() }

// Events
// Randomly reduce the level of arousal by a random percentage, then reduce by a further 10%
exports.onOrgasm = (data) => {
    addArousal(data.userID, data.prevArousal * Math.random() * 0.9);
}

// Tags
exports.tags = ["seal"]
// Name
exports.name = "Seal of the Capricious Breeze"