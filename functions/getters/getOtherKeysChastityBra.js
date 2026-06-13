/**********
 * Gets a combined list of cloned keys for chastity bras the userID is the primary keyholder for
 * 
 * - (user ID) userID - The primary keyholder of restraints
 * ---
 * ##### Returns an array of cloned chastity bra keys in the format "0000000000000000_00000000000000000" where the first set of 0s 
 * ##### is the person wearing the restraint, and the second set is the person holding the key clone.
 **********/
function getOtherKeysChastityBra(userID) {
    if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let ownedkeys = [];
	Object.keys(process.chastitybra).forEach((k) => {
		if (process.chastitybra[k].keyholder == userID) {
			if (process.chastitybra[k].clonedKeyholders) {
				process.chastitybra[k].clonedKeyholders.forEach((c) => {
					ownedkeys.push(`${k}_${c}`);
				});
			}
		}
	});
	return ownedkeys;
}

exports.getOtherKeysChastityBra = getOtherKeysChastityBra;