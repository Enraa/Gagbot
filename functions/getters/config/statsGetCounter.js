const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("./getProcessVariable");

/**********
 * Get the counter for a user by name.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to get
 * ---
 * ##### Returns the current value of the counter for the user
 **********/
function statsGetCounter(serverID, user, countername) {
    traceFirstParam(arguments[0]);
    return (getProcessVariable(serverID, user, "userstats") && getProcessVariable(serverID, user, "userstats")[countername]);
}

exports.statsGetCounter = statsGetCounter;