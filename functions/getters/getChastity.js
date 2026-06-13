/*********
 * Get the chastity belt that the user is wearing.
 * 
 * - (user id) user - The user ID of the chastity belt to retrieve
 * ---
 * ##### Returns the chastity belt object for the user. All chastity belt objects will have these properties:
 * - keyholder: User ID of the person who has the key for this chastity belt
 * - chastitytype: The type ID of this chastity belt
 * - timestamp: The time this chastity belt was applied to the wearer
 * - stateligible: If the chastity belt is restored from /outfit or other methods, will be **false** and won't be counted for longest chastity worn.
 * ###### Additional properties may be added by other functions
 *********/
function getChastity(user) {
    if (process.chastity == undefined) {
		process.chastity = {};
	}
	return process.chastity[user];
}

exports.getChastity = getChastity;