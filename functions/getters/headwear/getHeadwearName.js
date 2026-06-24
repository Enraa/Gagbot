const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getBaseHeadwear } = require("./getBaseHeadwear");

/**********
 * Gets the full name of a piece of headwear
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The user wearing the headgear
 * - (string) headnname - The string ID of the headgear
 * ---
 * ##### Returns a string with the full name of the headwear
 * ---
 * #### This needs cleanup to remove the userID param as it is not used!
 **********/
function getHeadwearName(serverID, userID, headnname) {
    traceFirstParam(arguments[0]);
    if (process.headwear == undefined) {
        process.headwear = {};
    }
    if (headnname) {
        return getBaseHeadwear(headnname)?.name
    }
    else {
        return undefined;
    }
}

exports.getHeadwearName = getHeadwearName;