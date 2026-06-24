const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getGag } = require("./getGag");

/*****
 * Gets the original binder for a gag by ID
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The user ID to retrieve a gag for
 * - (string) item - The string ID of the gag to get. 
 * ---
 * ##### Returns the user ID who put the gag on them
 *****/
function getGagBinder(serverID, userID, item) {
    traceFirstParam(arguments[0]);
	return getGag(serverID, userID, item)?.origbinder;
}

exports.getGagBinder = getGagBinder;