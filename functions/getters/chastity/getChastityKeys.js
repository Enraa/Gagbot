/**********
 * Gets the currently held chastity belt keys by the user.
 * 
 * - (user id) user - The User ID to get keys held by
 * ---
 * ##### Returns an array of user IDs the user is the primary keyholder for.
 **********/
function getChastityKeys(user) {
    if (process.chastity == undefined) {
		process.chastity = {};
	}
	let keysheld = [];
	Object.keys(process.chastity).forEach((k) => {
		if ((process.chastity[k].keyholder == user) && (!process.chastity[k]?.fumbled)) {
			keysheld.push(k);
		}
	});
	return keysheld;
}

exports.getChastityKeys = getChastityKeys;