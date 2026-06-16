const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Gets the currently held chastity bra keys by the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User ID to get keys held by
 * ---
 * ##### Returns an array of user IDs the user is the primary keyholder for.
 **********/
function getChastityBraKeys(serverID, user) {
    traceFirstParam(arguments[0]);
    if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
    if (process.chastitybra[serverID] == undefined) {
        process.chastitybra[serverID] = {};
    }
	let keysheld = [];
	Object.keys(process.chastitybra[serverID]).forEach((k) => {
		if ((process.chastitybra[serverID][k].keyholder == user) && (!process.chastitybra[serverID][k]?.fumbled)) {
			keysheld.push(k);
		}
	});
	return keysheld;
}

exports.getChastityBraKeys = getChastityBraKeys;