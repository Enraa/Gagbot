const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Gets the currently held chastity belt keys by the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User ID to get keys held by
 * ---
 * ##### Returns an array of user IDs the user is the primary keyholder for.
 **********/
function getChastityKeys(serverID, user) {
    traceFirstParam(arguments[0]);
    if (process.chastity == undefined) {
		process.chastity = {};
	}
    if (process.chastity[serverID] == undefined) {
        process.chastity[serverID] = {};
    }
	let keysheld = [];
	Object.keys(process.chastity[serverID]).forEach((k) => {
		if ((process.chastity[serverID][k].keyholder == user) && (!process.chastity[serverID][k]?.fumbled)) {
			keysheld.push(k);
		}
	});
	return keysheld;
}

exports.getChastityKeys = getChastityKeys;