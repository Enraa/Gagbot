/************
 * Gets the full chastity bra name of the User ID. Optionally will get the full chastity bra name of a chastity bra by ID.
 * 
 * - (user id) user - The User ID to get the chastity bra name of
 * - (string) chastityname - The chastity bra ID to retrieve the full name of
 * ##### *Note: This function should use either/or param, not both.*
 * ---
 * ##### Returns a string with the user-facing display name of the chastity bra.
 * ---
 * ###### Note: Needs rework into separate getChastityName and getChastityNameOnUser functions
 ************/
function getChastityBraName(userID, chastityname) {
    if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let convertchastityarr = {};
	for (let i = 0; i < process.autocompletes.chastitybra.length; i++) {
		convertchastityarr[process.autocompletes.chastitybra[i].value] = process.autocompletes.chastitybra[i].name;
	}
	if (chastityname) {
		return convertchastityarr[chastityname];
	} else if (process.chastitybra[userID]?.chastitytype) {
		return convertchastityarr[process.chastitybra[userID]?.chastitytype];
	} else {
		return undefined;
	}
}

exports.getChastityBraName = getChastityBraName;