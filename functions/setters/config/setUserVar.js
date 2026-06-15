/**********
 * Set a temporary user variable by key
 * 
 * - (user id) user - The User whose key to search for
 * - (string) key - The specific key to retrieve
 * - (any) value - The data to store in this user var
 * ---
 * ##### *No return value*
 **********/
function setUserVar(user, key, value) {
	if (process.usercontext == undefined) {
		process.usercontext = {};
	}
	if (process.usercontext[user] == undefined) {
		process.usercontext[user] = {};
	}
	process.usercontext[user][key] = value;
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.usercontext = true;
}

exports.setUserVar = setUserVar;