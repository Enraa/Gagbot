// Featherlight belts are intended to provide a small amount of 
// stimulation to the wearer at ALL times, whether vibed or not.
// They're also hard to let go in. 
exports.denialCoefficient = (data) => { return 15 }

exports.minVibe = (data) => { return 2 }

exports.minArousal = (data) => { return 1 }

// Calculate Arousal change
exports.vibelevel = (data) => { return 1 };

// Name
exports.name = "Featherlight Belt"