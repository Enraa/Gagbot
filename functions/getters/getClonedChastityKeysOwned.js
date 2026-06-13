/***********
 * Gets a list of cloned chastity belt keys the user is holding. 
 * 
 * - (user ID) userID - The user to check held keys
 * ---
 * ##### Returns an array of held cloned chastity belt keys in the format "0000000000000000_chastitybelt"
 ***********/
function getClonedChastityKeysOwned(userID) {
    if (process.chastity == undefined) {
		process.chastity = {};
	}
	let ownedkeys = [];
	Object.keys(process.chastity).forEach((k) => {
		if (process.chastity[k].clonedKeyholders) {
			if (process.chastity[k].clonedKeyholders.includes(userID)) {
				ownedkeys.push(`${k}_chastitybelt`);
			}
		}
	});
	return ownedkeys;
}

exports.getClonedChastityKeysOwned = getClonedChastityKeysOwned;