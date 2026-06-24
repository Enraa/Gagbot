const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/********
 * Gets the current floor the user is on. 
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) user - The user ID doing the delve
 * ---
 * ##### Returns undefined if they're not on a delve, 0 if at delve entrance, or an integer floor number
 ********/
function getCurrentFloor(serverID, user) {
    traceFirstParam(arguments[0]);
    return getProcessVariable(serverID, user, "delveuserdata")?.floor
}

exports.getCurrentFloor = getCurrentFloor;