const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/*********
 * Gets the worn corset for a user. Returns the corset if it exists, or undefined if not.
 * 
 * - (server id) serverID - The server this is running on
 * - (user ID) user - The user to get the corset for
 * ---
 * ##### Returns the current corset object for the user. All corsets will have:
 * - tightness: The current tightness 1-10 (up to 15)
 * - breath: Current breath value
 * - timestamp: The time the corset was put on
 * - origbinder: The user ID who put the corset on the user
 * - type: The type of corset (defaults to "corset_leather")
 * ###### Additional properties may be added by other functions
 *********/
function getCorset(serverID, user) {
    traceFirstParam(arguments[0]);
	return getProcessVariable(serverID, user, "corset");
}

exports.getCorset = getCorset;