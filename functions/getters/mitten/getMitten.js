/******
 * Gets the currently worn mittens for a user.
 * 
 * - (user ID) userID - The user ID to retrieve the mittens for
 * ---
 * ##### Returns the mitten object for the user. All mittens will have:
 * - mittenname: The ID of the mittens
 * - origbinder: The person who put the mittens on the user
 ******/
function getMitten(userID) {
    if (process.mitten == undefined) {
		process.mitten = {};
	}
	return process.mitten[userID];
}

exports.getMitten = getMitten;