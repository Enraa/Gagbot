const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getChastity } = require("./getChastity");

/*********
 * Gets a list of users with secondary key access to the user's chastity belt.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
function getClonedChastityKey(serverID, userID) {
    traceFirstParam(arguments[0]);
	return getChastity(serverID, userID)?.clonedKeyholders ?? [];
};

exports.getClonedChastityKey = getClonedChastityKey;