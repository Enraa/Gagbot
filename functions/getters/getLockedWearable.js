/**********
 * Gets a list of locked clothing the user is currently wearing
 * 
 * - (user id) userID - The user wearing the clothing
 * ---
 * ##### Returns an array with strings of wearable item IDs
 **********/
function getLockedWearable(userID) {
    if (process.wearable == undefined) {
		process.wearable = {};
	}
	return process.wearable[userID]?.locked ? process.wearable[userID]?.locked : [];
}

exports.getLockedWearable = getLockedWearable;