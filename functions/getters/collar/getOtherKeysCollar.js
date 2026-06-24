const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Gets a combined list of cloned keys for collars the userID is the primary keyholder for
 * 
 * - (server id) serverID - The server this is running on
 * - (user ID) userID - The primary keyholder of restraints
 * ---
 * ##### Returns an array of cloned collar keys in the format "0000000000000000_00000000000000000" where the first set of 0s 
 * ##### is the person wearing the restraint, and the second set is the person holding the key clone.
 **********/
function getOtherKeysCollar(serverID, userID) {
    traceFirstParam(arguments[0]);
    if (process.collar == undefined) {
		process.collar = {};
	}
    if (process.collar[serverID] == undefined) {
		process.collar[serverID] = {};
	}
	let ownedkeys = [];
	Object.keys(process.collar[serverID]).forEach((k) => {
		if (process.collar[serverID][k].keyholder == userID) {
			if (process.collar[serverID][k].clonedKeyholders) {
				process.collar[serverID][k].clonedKeyholders.forEach((c) => {
					ownedkeys.push(`${k}_${c}`);
				});
			}
		}
	});
	return ownedkeys;
}

exports.getOtherKeysCollar = getOtherKeysCollar;