const { markForSave } = require("../../other/markForSave");

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
	markForSave("usercontext");
}

exports.setUserVar = setUserVar;