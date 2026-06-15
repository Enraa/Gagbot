/**********
 * Gets a combined list of cloned keys for chastity belts the userID is the primary keyholder for
 * 
 * - (user ID) userID - The primary keyholder of restraints
 * ---
 * ##### Returns an array of cloned chastity belt keys in the format "0000000000000000_00000000000000000" where the first set of 0s 
 * ##### is the person wearing the restraint, and the second set is the person holding the key clone.
 **********/
function getOtherKeysChastity(userID) {
    if (process.chastity == undefined) {
		process.chastity = {};
	}
	let ownedkeys = [];
	Object.keys(process.chastity).forEach((k) => {
		if (process.chastity[k].keyholder == userID) {
			if (process.chastity[k].clonedKeyholders) {
				process.chastity[k].clonedKeyholders.forEach((c) => {
					ownedkeys.push(`${k}_${c}`);
				});
			}
		}
	});
	return ownedkeys;
}

exports.getOtherKeysChastity = getOtherKeysChastity;