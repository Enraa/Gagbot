/**********
 * Removes a locked headwear item from the user.
 * 
 * - (user id) userID - The person wearing the headgear
 * - (string) headwear - Headwear item ID
 * ---
 * ##### *No return value*
 **********/
function removeLockedHeadgear(userID, headwear) {
	if (process.headwear == undefined) {
		process.headwear = {};
	}
	if (process.headwear[userID]) {
		if (process.headwear[userID].locked == undefined) {
			return;
		} else {
			if (process.headwear[userID].locked.includes(headwear)) {
				process.headwear[userID].locked.splice(process.headwear[userID].locked.indexOf(headwear), 1);
			}
			if (process.headwear[userID].locked.length == 0) {
				delete process.headwear[userID].locked;
			}
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.headwear = true;
};

exports.removeLockedHeadgear = removeLockedHeadgear;