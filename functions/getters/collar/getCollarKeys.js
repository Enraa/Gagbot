/**********
 * Gets the currently held collar keys by the user.
 * 
 * - (user id) user - The User ID to get keys held by
 * ---
 * ##### Returns an array of user IDs the user is the primary keyholder for.
 **********/
function getCollarKeys(user) {
    if (process.collar == undefined) {
		process.collar = {};
	}
	let keysheld = [];
	Object.keys(process.collar).forEach((k) => {
		if ((process.collar[k].keyholder == user) && (!process.collar[k]?.fumbled)) {
			keysheld.push(k);
		}
	});
	return keysheld;
}

exports.getCollarKeys = getCollarKeys;