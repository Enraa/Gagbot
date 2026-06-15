/*******
 * Gets all of the outfits for the user.
 * 
 * - (user id) userID - The user whose outfits to retrieve
 *******/
function getOutfits(userID) {
	if (process.outfits == undefined) {
		process.outfits = {};
	}
	if (process.outfits[userID] == undefined) {
		process.outfits[userID] = [];
	}
	return process.outfits[userID];
}

exports.getOutfits = getOutfits;