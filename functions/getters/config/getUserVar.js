const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("./getProcessVariable");

/**********
 * Gets a temporary user variable by key
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User whose key to search for
 * - (string) key - The specific key to retrieve
 * ---
 * ##### Returns the value of the key
 **********/
function getUserVar(serverID, user, key) {
    traceFirstParam(arguments[0]);
	return getProcessVariable(serverID, user, "usercontext")[key];
}

exports.getUserVar = getUserVar;