/************
 * Gets the full wearable name of the User ID. Optionally will get the full wearable name of a wearable by ID.
 * 
 * - (user id) user - The User ID to get the wearable name of
 * - (string) wearablename - The wearable ID to retrieve the full name of
 * ##### *Note: This function should use either/or param, not both.*
 * ---
 * ##### Returns a string with the user-facing display name of the wearable.
 * ---
 * ###### Note: Needs rework to remove the first param and just use wearablename
 ************/
function getWearableName(userID, wearablename) {
    if (process.wearable == undefined) {
		process.wearable = {};
	}
	let convertmittenarr = {};
	for (let i = 0; i < process.wearabletypes.length; i++) {
		convertmittenarr[process.wearabletypes[i].value] = process.wearabletypes[i].name;
	}
	if (wearablename) {
		return convertmittenarr[wearablename];
	} else {
		return undefined;
	}
}

exports.getWearableName = getWearableName;