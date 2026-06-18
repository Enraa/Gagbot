const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/*******
 * Gets the protected headgear (/item protect) for the user.
 * 
 * - (user id) userID - The person with protected headgear
 * ---
 * ##### Returns an array of string item IDs designated as protected with /item protect
 *******/
function getLockedHeadgear(userID) {
    traceFirstParam(arguments[0]);
    return getProcessVariable(serverID, userID, "headwear")?.locked ?? []
}

exports.getLockedHeadgear = getLockedHeadgear;