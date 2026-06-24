const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Gets the last worn (top most) gag for a user.
 * 
 * - (server ID) serverID - The server this is on
 * - (user ID) userID - The user ID to retrieve a gag for
 * ---
 * ##### Returns the top most gag object for the user. All gags have:
 * - gagtype: The ID of the gag
 * - intensity: How tight the gag is (1-10)
 * - origbinder: Who put the gag on the user
 ********/
function getGagLast(serverID, userID) {
    traceFirstParam(arguments[0]);
    if (process.gags == undefined) {
		process.gags = {};
	}
    if (process.gags[serverID] == undefined) {
        process.gags[serverID] = {};
    }
	if (process.gags[serverID][userID] == undefined) {
		return undefined;
	}
	if (process.gags[serverID][userID].length > 0) {
		return process.gags[serverID][userID][process.gags[serverID][userID].length - 1].gagtype;
	} else {
		return undefined;
	}
}

exports.getGagLast = getGagLast;