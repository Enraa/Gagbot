const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/*******
 * Gets the user's current Resolve
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - User ID doing the Delve
 * ---
 * ##### Returns an integer with the current resolve of the user
 *******/
function getResolve(serverID, user) {
    traceFirstParam(arguments[0]);
    return getProcessVariable(serverID, user, "delveuserdata")?.resolve;
}

exports.getResolve = getResolve;