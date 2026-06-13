/*********
 * Get the chastity bra that the user is wearing.
 * 
 * - (user id) user - The user ID of the chastity bra to retrieve
 * ---
 * ##### Returns the chastity bra object for the user. All chastity bra objects will have these properties:
 * - keyholder: User ID of the person who has the key for this chastity bra
 * - chastitytype: The type ID of this chastity bra
 * - timestamp: The time this chastity bra was applied to the wearer
 * - stateligible: If the chastity bra is restored from /outfit or other methods, will be **false** and won't be counted for longest chastity worn.
 * ###### Additional properties may be added by other functions
 *********/
function getChastityBra(user) {
    if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	return process.chastitybra[user];
}

exports.getChastityBra = getChastityBra;