const { getOption } = require("../../functions/configfunctions")
const { discardKey } = require("../../functions/keyfindingfunctions")
const { rollKeyFumble } = require("../../functions/keyfindingfunctions")

// These values are used whenever they're unspecified on the belt in this folder.
// Growth Coefficient. Higher = more growth, this is a multiplier(?) on arousal gains
exports.growthCoefficient = (data) => { return 0.5 }

// Decay Coefficient. This is a modifier for which decay is REDUCED by when in chastity
exports.decayCoefficient = (data) => { return 0.2 }

// Denial Coefficient. This is the modifier for which arousal much reach to successfully let go
exports.denialCoefficient = (data) => { return 5 }

// Default vibe scaling is 0.6.
exports.vibeScaling = (data) => { return 0.6 }

// Fumble for belts.
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
    return discardKey(data.userID, data.keyholderID, "chastity belt")
}

// Category
exports.category = "Chastity Belt"

// Name
exports.name = "Default Chastity Belt"