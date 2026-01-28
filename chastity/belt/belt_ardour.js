// Belt of Undying Ardour
// This belt has a significantly higher growth coefficient
// and a minimum vibe. Notably, it offers no reprieve when letting go.
exports.growthCoefficient = (data) => { return 2.5 }
exports.decayCoefficient = (data) => { return 0.1 }
exports.denialCoefficient = (data) => { return 1 }
exports.minVibe = (data) => { return 3 }
// 5% of the normal cooldown time 
exports.orgasmCooldown = (data) => { return 0.05 }
// Regain 5% of the original arousal when letting go immediately. 
exports.orgasmArousalLeft = (data) => { return 0.05 }

// Name
exports.name = "Belt of Undying Ardour"