const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Adds a locked clothing item on the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the clothing
 * - (string) wearable - Wearable item ID
 * ---
 * ##### *No return value*
 **********/
function addLockedWearable(serverID, userID, wearable) {
    traceFirstParam(arguments[0]);
	if (process.wearable == undefined) {
		process.wearable = {};
	}
    if (process.wearable[serverID] == undefined) {
		process.wearable[serverID] = {};
	}
	if (process.wearable[serverID][userID]) {
		if (process.wearable[serverID][userID].locked == undefined) {
			process.wearable[serverID][userID].locked = [wearable];
		} else {
			process.wearable[serverID][userID].locked.push(wearable);
		}
	}
	markForSave("wearable");
};

exports.addLockedWearable = addLockedWearable;