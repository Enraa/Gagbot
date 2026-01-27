// Timekeeper's Belt
// This belt has a low growth and decay coefficient
// as well as a reduced time scale. 
exports.growthCoefficient = (data) => { return 0.1 }
exports.decayCoefficient = (data) => { return 0.1 }
exports.timescale = (data) => { return 0.1 }
exports.minDecay = (data) => { return -0.1 }
exports.maxDecay = (data) => { return 0.1 }
exports.denialCoefficient = (data) => { return 10 }

// Name
exports.name = "Timekeeper's Belt"