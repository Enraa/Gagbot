const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getCollar } = require("./getCollar");

/*********
 * Gets a list of users with secondary key access to the collaruser.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) collaruser - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
function getClonedCollarKey(serverID, collaruser) {
    traceFirstParam(arguments[0]);
	return getCollar(serverID, collaruser)?.clonedKeyholders ?? [];
}

exports.getClonedCollarKey = getClonedCollarKey;