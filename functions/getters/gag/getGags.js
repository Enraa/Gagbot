/*******
 * Get all of the gags worn by the user ID
 * 
 * - (user id) userID - The person wearing the gags
 * ---
 * ##### Returns an array of gag objects
 *******/
function getGags(userID) {
	if (process.gags == undefined) {
		process.gags = {};
	}
	return process.gags[userID] ?? [];
};

exports.getGags = getGags;