const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Removes a locked headwear item from the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the headgear
 * - (string) headwear - Headwear item ID
 * ---
 * ##### *No return value*
 **********/
function removeLockedHeadgear(serverID, userID, headwear) {
    traceFirstParam(arguments[0]);
	if (process.headwear == undefined) {
		process.headwear = {};
	}
    if (process.headwear[serverID] == undefined) {
		process.headwear[serverID] = {};
	}
	if (process.headwear[serverID][userID]) {
		if (process.headwear[serverID][userID].locked == undefined) {
			return;
		} else {
			if (process.headwear[serverID][userID].locked.includes(headwear)) {
				process.headwear[serverID][userID].locked.splice(process.headwear[serverID][userID].locked.indexOf(headwear), 1);
			}
			if (process.headwear[serverID][userID].locked.length == 0) {
				delete process.headwear[serverID][userID].locked;
			}
		}
	}
	markForSave("headwear");
};

exports.removeLockedHeadgear = removeLockedHeadgear;