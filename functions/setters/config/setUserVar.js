const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Set a temporary user variable by key
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User whose key to search for
 * - (string) key - The specific key to retrieve
 * - (any) value - The data to store in this user var
 * ---
 * ##### *No return value*
 **********/
function setUserVar(serverID, user, key, value) {
    traceFirstParam(arguments[0]);
	if (process.usercontext == undefined) {
		process.usercontext = {};
	}
    if (process.usercontext[serverID] == undefined) {
		process.usercontext[serverID] = {};
	}
	if (process.usercontext[serverID][user] == undefined) {
		process.usercontext[serverID][user] = {};
	}
	process.usercontext[serverID][user][key] = value;
	markForSave("usercontext");
}

exports.setUserVar = setUserVar;