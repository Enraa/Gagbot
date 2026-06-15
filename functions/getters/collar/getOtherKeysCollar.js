/**********
 * Gets a combined list of cloned keys for collars the userID is the primary keyholder for
 * 
 * - (user ID) userID - The primary keyholder of restraints
 * ---
 * ##### Returns an array of cloned collar keys in the format "0000000000000000_00000000000000000" where the first set of 0s 
 * ##### is the person wearing the restraint, and the second set is the person holding the key clone.
 **********/
function getOtherKeysCollar(userID) {
    if (process.collar == undefined) {
		process.collar = {};
	}
	let ownedkeys = [];
	Object.keys(process.collar).forEach((k) => {
		if (process.collar[k].keyholder == userID) {
			if (process.collar[k].clonedKeyholders) {
				process.collar[k].clonedKeyholders.forEach((c) => {
					ownedkeys.push(`${k}_${c}`);
				});
			}
		}
	});
	return ownedkeys;
}

exports.getOtherKeysCollar = getOtherKeysCollar;