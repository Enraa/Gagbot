const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("./getProcessVariable");

/*******
 * Gets all of the outfits for the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user whose outfits to retrieve
 *******/
function getOutfits(serverID, userID) {
    traceFirstParam(arguments[0]);
	return getProcessVariable(serverID, userID, "outfits") ?? [];
}

exports.getOutfits = getOutfits;