// These values are used whenever they're unspecified on the bra in this folder.
// Growth Coefficient. Higher = more growth, this is a multiplier(?) on arousal gains
exports.growthCoefficient = (data) => { return 1 }

// Decay Coefficient. This is a modifier for which decay is REDUCED by when in chastity
exports.decayCoefficient = (data) => { return 0.6 }

// Denial Coefficient. This is the modifier for which arousal much reach to successfully let go
exports.denialCoefficient = (data) => { return 3 }

// Default vibe scaling is 0.3.
exports.vibeScaling = (data) => { return 0.3 }

// Category
exports.category = "Chastity Bra"

// Name
exports.name = "Default Chastity Bra"