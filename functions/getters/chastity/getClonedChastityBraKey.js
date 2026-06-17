const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getChastityBra } = require("./getChastityBra");

/*********
 * Gets a list of users with secondary key access to the user's chastity bra.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
function getClonedChastityBraKey(serverID, userID) {
    traceFirstParam(arguments[0]);
	return getChastityBra(serverID, userID)?.clonedKeyholders ?? [];
};

exports.getClonedChastityBraKey = getClonedChastityBraKey;