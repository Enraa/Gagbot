const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getCorset } = require("./getCorset");

/**********
 * Gets the origbinder of someone's corset, if worn.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user wearing the corset
 * ---
 * ##### Returns the user ID of the person who put this corset on the wearer.
 **********/
function getCorsetBinder(serverID, user) {
    traceFirstParam(arguments[0]);
	return getCorset(serverID, user)?.origbinder;
}

exports.getCorsetBinder = getCorsetBinder;