const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Removes a locked clothing item from the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the clothing
 * - (string) wearable - Headwear item ID
 * ---
 * ##### *No return value*
 **********/
function removeLockedWearable(serverID, userID, wearable) {
    traceFirstParam(arguments[0]);
	if (process.wearable == undefined) {
		process.wearable = {};
	}
    if (process.wearable[serverID] == undefined) {
		process.wearable[serverID] = {};
	}
	if (process.wearable[serverID][userID]) {
		if (process.wearable[serverID][userID].locked == undefined) {
			return;
		} else {
			if (process.wearable[serverID][userID].locked.includes(wearable)) {
				process.wearable[serverID][userID].locked.splice(process.wearable[serverID][userID].locked.indexOf(wearable), 1);
			}
			if (process.wearable[serverID][userID].locked.length == 0) {
				delete process.wearable[serverID][userID].locked;
			}
		}
	}
	markForSave("wearable");
};

exports.removeLockedWearable = removeLockedWearable;