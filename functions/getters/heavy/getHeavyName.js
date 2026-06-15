const { heavytypes } = require("../../heavyfunctions");

/**********
 * Gets the heavy bondage full name from its item ID
 * 
 * - (string) type - The string item ID to search
 * ---
 * ##### Returns a string with the heavy bondage's name
 **********/
function getHeavyName(type) {
    return heavytypes.find((h) => h.value === type)?.name
}

exports.getHeavyName = getHeavyName;
// The original function that is mostly in use for this is convertheavy. 
// We should refactor that sometime.
exports.convertheavy = getHeavyName;