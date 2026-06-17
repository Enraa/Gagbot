const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getChastity } = require("./getChastity");

/**********
 * Gets the primary keyholder for a person's chastity belt.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User ID to get the chastity belt for
 * ---
 * ##### Returns a string with the user ID of the primary keyholder for the user's chastity belt.
 **********/
function getChastityKeyholder(serverID, user) {
    traceFirstParam(arguments[0]);
	return getChastity(serverID, user)?.keyholder;
}

exports.getChastityKeyholder = getChastityKeyholder;