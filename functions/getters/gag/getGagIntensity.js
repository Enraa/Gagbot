const { getGag } = require("./getGag");

/********
 * Gets the intensity of the first worn gag. This function isn't used at all and should be removed.
 * 
 * - (user ID) userID - The user ID to retrieve the first gag for
 * ---
 * ##### Returns the intensity of the first gag
 ********/
function getGagIntensity(userID) {
    return getGag(userID)?.intensity;
}

exports.getGagIntensity = getGagIntensity;