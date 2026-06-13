/*********
 * Gets a list of users with secondary key access to the user's chastity belt.
 * 
 * - (user id) userID - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
function getClonedChastityKey(userID) {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	let returnval = process.chastity[userID]?.clonedKeyholders ?? [];
	return returnval;
};

exports.getClonedChastityKey = getClonedChastityKey;