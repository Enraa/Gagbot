/********
 * Gets the last worn (top most) gag for a user.
 * 
 * - (user ID) userID - The user ID to retrieve a gag for
 * ---
 * ##### Returns the top most gag object for the user. All gags have:
 * - gagtype: The ID of the gag
 * - intensity: How tight the gag is (1-10)
 * - origbinder: Who put the gag on the user
 ********/
function getGagLast(userID) {
    if (process.gags == undefined) {
		process.gags = {};
	}
	if (process.gags[userID] == undefined) {
		return undefined;
	}

	if (process.gags[userID].length > 0) {
		return process.gags[userID][process.gags[userID].length - 1].gagtype;
	} else {
		return undefined;
	}
}

exports.getGagLast = getGagLast;