/*********
 * Get a list of the heavy bondage worn by the user
 * 
 * - (user id) user - The user wearing the heavy bondage
 * ---
 * ##### Returns an array of all of the heavy bondage objects worn by the user. All Heavy Bondage objects have:
 * - type: The item ID of the heavy bondage
 * - origbinder: The person who applied this heavy bondage
 * - displayname: The display name of this heavy bondage
 * - namedcontainerowner?: User ID included in container checks
 *********/
function getHeavyList(user) {
    if (process.heavy == undefined) {
		process.heavy = {};
	}
    if (process.heavy[user]) {
        return process.heavy[user];
    }
	else {
        return [];
    }
}

exports.getHeavyList = getHeavyList;