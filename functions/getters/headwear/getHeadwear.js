const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/*******
 * Get the worn headwear for a user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user that's wearing the head gear
 * ---
 * ##### Returns an array with string item IDs the user is wearing
 *******/
function getHeadwear(serverID, userID) {
    traceFirstParam(arguments[0]);
    return getProcessVariable(serverID, userID, "headwear")?.wornheadwear ?? []
}

exports.getHeadwear = getHeadwear;