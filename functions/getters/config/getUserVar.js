/**********
 * Gets a temporary user variable by key
 * 
 * - (user id) user - The User whose key to search for
 * - (string) key - The specific key to retrieve
 * ---
 * ##### Returns the value of the key
 **********/
function getUserVar(user, key) {
	if (process.usercontext == undefined) {
		process.usercontext = {};
	}
	if (process.usercontext[user] == undefined) {
		process.usercontext[user] = {};
	}
	return process.usercontext[user][key];
}

exports.getUserVar = getUserVar;