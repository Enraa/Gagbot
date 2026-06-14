/**********
 * Adds a locked headwear item on the user.
 * 
 * - (user id) userID - The person wearing the collar
 * - (string) headwear - Headwear item ID
 * ---
 * ##### *No return value*
 **********/
function addLockedHeadgear(userID, headwear) {
	if (process.headwear == undefined) {
		process.headwear = {};
	}
	if (process.headwear[userID]) {
		if (process.headwear[userID].locked == undefined) {
			process.headwear[userID].locked = [headwear];
		} else {
			process.headwear[userID].locked.push(headwear);
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.headwear = true;
};

exports.addLockedHeadgear = addLockedHeadgear;