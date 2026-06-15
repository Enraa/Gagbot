/**************
 * Adds a wearable clothing item to a user. 
 * 
 * - (user id) user - The user to wear the clothing
 * - (string) wearable - The specific wearable type
 * ---
 * ##### *No return value*
 **************/
function assignWearable(user, wearable) {
    if (process.wearable == undefined) {
		process.wearable = {};
	}
	if (process.wearable[user]) {
		process.wearable[user].wornwearable.push(wearable);
	} else {
		process.wearable[user] = { wornwearable: [wearable] };
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.wearable = true;
};

exports.assignWearable = assignWearable;