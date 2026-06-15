const { markForSave } = require("../../other/markForSave");

/**********
 * Removes a locked clothing item from the user.
 * 
 * - (user id) userID - The person wearing the clothing
 * - (string) wearable - Headwear item ID
 * ---
 * ##### *No return value*
 **********/
function removeLockedWearable(userID, wearable) {
	if (process.wearable == undefined) {
		process.wearable = {};
	}
	if (process.wearable[userID]) {
		if (process.wearable[userID].locked == undefined) {
			return;
		} else {
			if (process.wearable[userID].locked.includes(wearable)) {
				process.wearable[userID].locked.splice(process.wearable[userID].locked.indexOf(wearable), 1);
			}
			if (process.wearable[userID].locked.length == 0) {
				delete process.wearable[userID].locked;
			}
		}
	}
	markForSave("wearable");
};

exports.removeLockedWearable = removeLockedWearable;