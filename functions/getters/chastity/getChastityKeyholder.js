const { getChastity } = require("./getChastity");

/**********
 * Gets the primary keyholder for a person's chastity belt.
 * 
 * - (user id) user - The User ID to get the chastity belt for
 * ---
 * ##### Returns a string with the user ID of the primary keyholder for the user's chastity belt.
 **********/
function getChastityKeyholder(user) {
	return getChastity(user)?.keyholder;
}

exports.getChastityKeyholder = getChastityKeyholder;