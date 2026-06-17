const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Gets the currently held collar keys by the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User ID to get keys held by
 * ---
 * ##### Returns an array of user IDs the user is the primary keyholder for.
 **********/
function getCollarKeys(serverID, user) {
    traceFirstParam(arguments[0]);
    if (process.collar == undefined) {
		process.collar = {};
	}
    if (process.collar[serverID] == undefined) {
		process.collar[serverID] = {};
	}
	let keysheld = [];
	Object.keys(process.collar[serverID]).forEach((k) => {
		if ((process.collar[serverID][k].keyholder == user) && (!process.collar[serverID][k]?.fumbled)) {
			keysheld.push(k);
		}
	});
	return keysheld;
}

exports.getCollarKeys = getCollarKeys;