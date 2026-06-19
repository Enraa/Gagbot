const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { statsAddCounter } = require("../config/statsAddCounter");

/**********
 * Adds or modifies a gag on the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the gag
 * - (string) gagtype - The type of gag applied to the wearer
 * - (integer) intensity - How tight the gag is applied to the wearer
 * - (user id) origbinder - Who's adding/modifying the gag
 * ---
 * ##### *No return value*
 **********/
function assignGag(serverID, userID, gagtype = "ball", intensity = 5, origbinder) {
    traceFirstParam(arguments[0]);
	if (process.gags == undefined) {
		process.gags = {};
	}
    if (process.gags[serverID] == undefined) {
		process.gags[serverID] = [];
	}
	if (process.gags[serverID][userID] == undefined) {
		process.gags[serverID][userID] = [];
	}
	// Retrieve the index if it is already on the wearer.
	let foundgag = process.gags[serverID][userID].findIndex((s) => s.gagtype == gagtype);
	let originalbinder = origbinder;
	if (foundgag > -1) {
		originalbinder = process.gags[serverID][userID][foundgag].origbinder;
		process.gags[serverID][userID].splice(foundgag, 1);
	}
	process.gags[serverID][userID].push({ gagtype: gagtype, intensity: intensity, origbinder: originalbinder });

    statsAddCounter(serverID, userID, "worngags")
    
    markForSave("gags");
    markForSave("userstats");
};

exports.assignGag = assignGag;