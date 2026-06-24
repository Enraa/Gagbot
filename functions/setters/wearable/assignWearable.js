const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**************
 * Adds a wearable clothing item to a user. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user to wear the clothing
 * - (string) wearable - The specific wearable type
 * ---
 * ##### *No return value*
 **************/
function assignWearable(serverID, user, wearable) {
    traceFirstParam(arguments[0]);
    if (process.wearable == undefined) {
		process.wearable = {};
	}
    if (process.wearable[serverID] == undefined) {
		process.wearable[serverID] = {};
	}
	if (process.wearable[serverID][user]) {
		process.wearable[serverID][user].wornwearable.push(wearable);
	} else {
		process.wearable[serverID][user] = { wornwearable: [wearable] };
	}
	markForSave("wearable");
};

exports.assignWearable = assignWearable;