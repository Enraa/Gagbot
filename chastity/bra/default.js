const { canAccessChastityBra } = require("../../functions/getters/chastity/canAccessChastityBra")
const { getOption } = require("../../functions/getters/config/getOption")
const { rollKeyFumble, discardKey } = require("../../functions/keyfindingfunctions")

// These values are used whenever they're unspecified on the bra in this folder.
// Growth Coefficient. Higher = more growth, this is a multiplier(?) on arousal gains
exports.growthCoefficient = (data) => { return 1 }

// Decay Coefficient. This is a modifier for which decay is REDUCED by when in chastity
exports.decayCoefficient = (data) => { return 0.6 }

// Denial Coefficient. This is the modifier for which arousal much reach to successfully let go
exports.denialCoefficient = (data) => { return 3 }

// Default vibe scaling is 0.3.
exports.vibeScaling = (data) => { return 0.3 }

// Fumble for bras.
exports.fumble = (data) => {
    if (getOption(data.userID, "fumbling") == "disabled") { return 0 }
    let fumble = rollKeyFumble(data.keyholderID, data.userID);
    if (fumble > 1 && (getOption(data.userID, "keyloss") == "disabled")) {
        fumble = 1; // force it back to a no key loss
    }
    return fumble;
}

// Discard for bras
exports.discard = (data) => {
    return discardKey(data.userID, data.keyholderID, "chastity bra")
}

exports.canUnequip = (data) => { return canAccessChastityBra(data.userID, data.keyholderID, true).access }

exports.canAccessToys = (data) => { return (canAccessChastityBra(data.userID, data.keyholderID).access) }

// Category
exports.category = "Chastity Bra"

// Name
exports.name = "Default Chastity Bra"