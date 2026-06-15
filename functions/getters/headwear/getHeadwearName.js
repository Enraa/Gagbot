const { getBaseHeadwear } = require("./getBaseHeadwear");

/**********
 * Gets the full name of a piece of headwear
 * 
 * - (user ID) userID - The user wearing the headgear
 * - (string) headnname - The string ID of the headgear
 * ---
 * ##### Returns a string with the full name of the headwear
 * ---
 * #### This needs cleanup to remove the userID param as it is not used!
 **********/
function getHeadwearName(userID, headnname) {
    if (process.headwear == undefined) {
        process.headwear = {};
    }
    if (headnname) {
        return getBaseHeadwear(headnname).name
    }
    else {
        return undefined;
    }
}

exports.getHeadwearName = getHeadwearName;