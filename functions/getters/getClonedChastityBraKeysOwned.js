/***********
 * Gets a list of cloned chastity bra keys the user is holding. 
 * 
 * - (user ID) userID - The user to check held keys
 * ---
 * ##### Returns an array of held cloned chastity bra keys in the format "0000000000000000_chastitybra"
 ***********/
function getClonedChastityBraKeysOwned(userID) {
    if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let ownedkeys = [];
	Object.keys(process.chastitybra).forEach((k) => {
		if (process.chastitybra[k].clonedKeyholders) {
			if (process.chastitybra[k].clonedKeyholders.includes(userID)) {
				ownedkeys.push(`${k}_chastitybra`);
			}
		}
	});
	return ownedkeys;
}

exports.getClonedChastityBraKeysOwned = getClonedChastityBraKeysOwned;