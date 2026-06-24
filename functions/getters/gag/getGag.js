const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Gets the first worn gag for the user ID, or the specific gag by type if specified
 * 
 * - (server ID) serverID - The server this is on
 * - (user ID) userID - The user ID to retrieve a gag for
 * - (string) gagbyname? - The string ID of the gag to get. If undefined, returns first gag
 * ---
 * ##### Returns first gag object or the specific gag object by type for a user. All gags have:
 * - gagtype: The ID of the gag
 * - intensity: How tight the gag is (1-10)
 * - origbinder: Who put the gag on the user
 **********/
function getGag(serverID, userID, gagbyname) {
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
	if (gagbyname) {
		let foundgag = process.gags[serverID][userID].find((s) => s.gagtype == gagbyname);
		return foundgag;
	} 
    else if (process.gags[serverID][userID].length > 0) {
		return process.gags[serverID][userID][0].gagtype; 
	}
	return undefined;
}

exports.getGag = getGag;