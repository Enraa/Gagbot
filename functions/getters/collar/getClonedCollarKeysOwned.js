const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/***********
 * Gets a list of cloned collar keys the user is holding. 
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The user to check held keys
 * ---
 * ##### Returns an array of held cloned collar keys in the format "0000000000000000_collar"
 ***********/
function getClonedCollarKeysOwned(serverID, userID) {
    traceFirstParam(arguments[0]);
    if (process.collar == undefined) {
		process.collar = {};
	}
    if (process.collar[serverID] == undefined) {
		process.collar[serverID] = {};
	}
	let ownedkeys = [];
	Object.keys(process.collar[serverID]).forEach((k) => {
		if (process.collar[serverID][k].clonedKeyholders) {
			if (process.collar[serverID][k].clonedKeyholders.includes(userID)) {
				ownedkeys.push(`${k}_collar`);
			}
		}
	});
	return ownedkeys;
}

exports.getClonedCollarKeysOwned = getClonedCollarKeysOwned;