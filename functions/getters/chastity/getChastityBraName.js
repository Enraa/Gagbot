const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/************
 * Gets the full chastity bra name of the User ID. Optionally will get the full chastity bra name of a chastity bra by ID.
 * 
 * - (server id) serverID - The server this is running on 
 * - (user id) user - The User ID to get the chastity bra name of
 * - (string) chastityname - The chastity bra ID to retrieve the full name of
 * ##### *Note: This function should use either/or param, not both.*
 * ---
 * ##### Returns a string with the user-facing display name of the chastity bra.
 * ---
 * ###### Note: Needs rework into separate getChastityName and getChastityNameOnUser functions
 ************/
function getChastityBraName(serverID, userID, chastityname) {
    traceFirstParam(arguments[0]);
	let convertchastityarr = {};
	for (let i = 0; i < process.autocompletes.chastitybra.length; i++) {
		convertchastityarr[process.autocompletes.chastitybra[i].value] = process.autocompletes.chastitybra[i].name;
	}
	if (chastityname) {
		return convertchastityarr[chastityname];
	} else {
        return convertchastityarr[getProcessVariable(serverID, userID, "chastitybra").chastitytype];
    }
}

exports.getChastityBraName = getChastityBraName;