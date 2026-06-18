const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Gets a list of clothing the user is currently wearing
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user wearing the clothing
 * ---
 * ##### Returns an array with strings of wearable item IDs
 **********/
function getWearable(serverID, userID) {
    traceFirstParam(arguments[0]);
    return getProcessVariable(serverID, userID, "wearable")?.wornwearable ?? [];
}

exports.getWearable = getWearable;