const { getArousal } = require("../../functions/getters/arousal/getArousal");
const { getBaseChastity } = require("../../functions/getters/chastity/getBaseChastity");
const { getChastityBra } = require("../../functions/getters/chastity/getChastityBra");

// Chastity Belt of Eternal Edging
// The Denial Coefficient output of this belt will always be set to 1% higher than the wearer's current arousal. 
exports.denialCoefficient = (data) => { 
    let braval = getBaseChastity(getChastityBra(data.userID)?.chastitytype)?.denialCoefficient() ?? 0;
    let outnum = Math.round((getArousal(data.userID) / 10 * 1.01) * 10) / 10;
    outnum = outnum - braval;
    if (Math.round(outnum * 10) == Math.round(getArousal(data.userID))) {
        outnum += 0.1;
    }
    return Math.max(outnum, 1.0)
}

exports.growthCoefficient = (data) => { return 1.0 } // 100% higher than usual for belts!

// Name
exports.name = "Chastity Belt of Eternal Edging"

// Tags
exports.tags = ["chastity"]