const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getChastityBra } = require("./getChastityBra");

/**********
 * Gets the primary keyholder for a person's chastity bra.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User ID to get the chastity bra for
 * ---
 * ##### Returns a string with the user ID of the primary keyholder for the user's chastity bra.
 **********/
function getChastityBraKeyholder(serverID, user) {
    traceFirstParam(arguments[0]);
	return getChastityBra(serverID, user)?.keyholder;
}

exports.getChastityBraKeyholder = getChastityBraKeyholder;