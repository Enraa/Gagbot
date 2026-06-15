/**********
 * Gets the first worn gag for the user ID, or the specific gag by type if specified
 * 
 * - (user ID) userID - The user ID to retrieve a gag for
 * - (string) gagbyname? - The string ID of the gag to get. If undefined, returns first gag
 * ---
 * ##### Returns first gag object or the specific gag object by type for a user. All gags have:
 * - gagtype: The ID of the gag
 * - intensity: How tight the gag is (1-10)
 * - origbinder: Who put the gag on the user
 **********/
function getGag(userID, gagbyname) {
    if (process.gags == undefined) {
		process.gags = {};
	}
	if (process.gags[userID] == undefined) {
		return undefined;
	}
	if (gagbyname) {
		let foundgag = process.gags[userID].find((s) => s.gagtype == gagbyname);
		return foundgag;
	} 
    else if (process.gags[userID].length > 0) {
		return process.gags[userID][0].gagtype; 
	}
	return undefined;
}

exports.getGag = getGag;