// This is the base definition for a corset. Any new functionality that references a property
// MUST have that reference here to ensure all corsets are constructed with a default. 
// The default values should generally "do nothing" as they will be overridden by the 
// appropriate corset's individual .js file
function Corset() {
    // Max Breath - this is the most breath a wearer can have, from 0-15
    this.maxBreath = [2000, 56, 48, 40, 34, 28, 24, 20, 16, 13, 10, 7, 4, 3, 2, 2];

    // Min Breath - this is the least breath a wearer can have, from 0-15
    this.minBreath = [0, -120, -116, -112, -108, -104, -96, -88, -80, -72, -60, -60, -48, -40, -30, -20];

    // Breath Recovery - this is the breath recovered per second before modifications from worn gags
    this.breathRecovery = [2000, 4.6, 3.8, 3.2, 2.6, 2, 1.6, 1.28, 1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.04, 0.008];

    // Gasp Coefficient - increases the likelyhood of gasps being added
    this.gaspCoefficient = 1

    // Gasp Limit - the maximum breath to start adding gasps
    this.gaspLimit = [1000, 28, 24, 20, 17, 14, 12, 10, 8, 6.5, 5, 3.5, 2, 1.5, 1, 1]

    // Silence Limit - the minimum breath before no longer being able to speak
    this.silenceLimit = [-2000, -56, -48, -40, -34, -28, -24, -20, -16, -13, -10, -7, -4, -3, -2, -2]

    // Minimum Words - At LEAST this number of words can be said!
    this.minWords = [10, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0]

    // Get Max Breath!
    this.getMaxBreath = function (data) { return this.maxBreath[data.tightness] ?? 2000 }

    // Get Min Breath!
    this.getMinBreath = function (data) { return this.minBreath[data.tightness] ?? 0 }

    // Get Breath Recovery
    this.getBreathRecovery = function (data) { return this.breathRecovery[data.tightness] ?? 2000 }

    // Get Gasp Limit
    this.getGaspLimit = function (data) { return this.gaspLimit[data.tightness] ?? 1000 }

    // Get Silence Limit
    this.getSilenceLimit = function (data) { return this.silenceLimit[data.tightness] ?? -2000 }

    // Get Minimum Words
    this.getMinWords = function (data) { return this.minWords[data.tightness] ?? 10 }

    // Event: After using breath: Called after using breath to speak!
    this.afterUsingBreath = (data) => { return false }

    // Event: on Equip: Called when wearing the corset
    this.onEquip = function (data) { return false }

    // Event: on Unequip: Called when removing the corset
    this.onUnequip = function (data) { return false };

    // Event: on Adjust Tightness: Called when changing tightness on existing corset
    this.onAdjustTightness = function (data) { return false };

    // Category
    this.category = "default"

    // Tags
    this.tags = [];

    // Name
    this.name = "Default Corset"
}

exports.Corset = Corset;