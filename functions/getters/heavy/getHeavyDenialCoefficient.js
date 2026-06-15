const { getBaseHeavy } = require("./getBaseHeavy");

/*********
 * Get a Heavy Bondage's denial coefficient
 * 
 * - (string) type - The item ID of the heavy
 * ---
 * ##### Returns the number representing that heavy bondage's denial coefficient
 *********/
function getHeavyDenialCoefficient(type) {
    return getBaseHeavy(type)?.denialCoefficient;
}

exports.getHeavyDenialCoefficient = getHeavyDenialCoefficient;
exports.heavyDenialCoefficient = getHeavyDenialCoefficient;