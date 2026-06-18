const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/******
 * Gets the currently worn mittens for a user.
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The user ID to retrieve the mittens for
 * ---
 * ##### Returns the mitten object for the user. All mittens will have:
 * - mittenname: The ID of the mittens
 * - origbinder: The person who put the mittens on the user
 ******/
function getMitten(serverID, userID) {
    traceFirstParam(arguments[0]);
    return getProcessVariable(serverID, userID, "mitten");
}

exports.getMitten = getMitten;