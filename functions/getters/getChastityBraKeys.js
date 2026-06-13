/**********
 * Gets the currently held chastity bra keys by the user.
 * 
 * - (user id) user - The User ID to get keys held by
 * ---
 * ##### Returns an array of user IDs the user is the primary keyholder for.
 **********/
function getChastityBraKeys(user) {
    if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let keysheld = [];
	Object.keys(process.chastitybra).forEach((k) => {
		if ((process.chastitybra[k].keyholder == user) && (!process.chastitybra[k]?.fumbled)) {
			keysheld.push(k);
		}
	});
	return keysheld;
}

exports.getChastityBraKeys = getChastityBraKeys;