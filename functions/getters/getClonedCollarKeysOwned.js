/***********
 * Gets a list of cloned collar keys the user is holding. 
 * 
 * - (user ID) userID - The user to check held keys
 * ---
 * ##### Returns an array of held cloned collar keys in the format "0000000000000000_collar"
 ***********/
function getClonedCollarKeysOwned(userID) {
    if (process.collar == undefined) {
		process.collar = {};
	}
	let ownedkeys = [];
	Object.keys(process.collar).forEach((k) => {
		if (process.collar[k].clonedKeyholders) {
			if (process.collar[k].clonedKeyholders.includes(userID)) {
				ownedkeys.push(`${k}_collar`);
			}
		}
	});
	return ownedkeys;
}

exports.getClonedCollarKeysOwned = getClonedCollarKeysOwned;