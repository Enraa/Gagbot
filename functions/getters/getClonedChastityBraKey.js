/*********
 * Gets a list of users with secondary key access to the user's chastity bra.
 * 
 * - (user id) userID - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
function getClonedChastityBraKey(userID) {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let returnval = process.chastitybra[userID]?.clonedKeyholders ?? [];
	return returnval;
};

exports.getClonedChastityBraKey = getClonedChastityBraKey;