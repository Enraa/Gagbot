const { getChastity } = require("./getChastity");

/*********
 * Gets a list of users with secondary key access to the user's chastity belt.
 * 
 * - (user id) userID - The User ID wearing the collar
 * ---
 * ##### Returns an array of user IDs with secondary access to this collar.
 *********/
function getClonedChastityKey(userID) {
	return getChastity(userID)?.clonedKeyholders ?? [];
};

exports.getClonedChastityKey = getClonedChastityKey;