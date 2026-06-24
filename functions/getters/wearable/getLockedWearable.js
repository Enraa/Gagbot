const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/**********
 * Gets a list of locked clothing the user is currently wearing
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user wearing the clothing
 * ---
 * ##### Returns an array with strings of wearable item IDs
 **********/
function getLockedWearable(serverID, userID) {
    traceFirstParam(arguments[0]);
    return getProcessVariable(serverID, userID, "wearable")?.locked ?? [];
}

exports.getLockedWearable = getLockedWearable;