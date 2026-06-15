/************
 * Gets the full chastity belt name of the User ID. Optionally will get the full chastity belt name of a chastity belt by ID.
 * 
 * - (user id) user - The User ID to get the chastity belt name of
 * - (string) chastityname - The chastity belt ID to retrieve the full name of
 * ##### *Note: This function should use either/or param, not both.*
 * ---
 * ##### Returns a string with the user-facing display name of the chastity belt.
 * ---
 * ###### Note: Needs rework into separate getChastityName and getChastityNameOnUser functions
 ************/
function getChastityName(userID, chastityname) {
    if (process.chastity == undefined) {
		process.chastity = {};
	}
	let convertchastityarr = {};
	for (let i = 0; i < process.autocompletes.chastitybelt.length; i++) {
		convertchastityarr[process.autocompletes.chastitybelt[i].value] = process.autocompletes.chastitybelt[i].name;
	}
	if (chastityname) {
		return convertchastityarr[chastityname];
	} else if (process.chastity[userID]?.chastitytype) {
		return convertchastityarr[process.chastity[userID]?.chastitytype];
	} else {
		return undefined;
	}
}

exports.getChastityName = getChastityName;