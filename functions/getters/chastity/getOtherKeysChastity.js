const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Gets a combined list of cloned keys for chastity belts the userID is the primary keyholder for
 * 
 * - (server id) serverID - The server this is running on
 * - (user ID) userID - The primary keyholder of restraints
 * ---
 * ##### Returns an array of cloned chastity belt keys in the format "0000000000000000_00000000000000000" where the first set of 0s 
 * ##### is the person wearing the restraint, and the second set is the person holding the key clone.
 **********/
function getOtherKeysChastity(serverID, userID) {
    traceFirstParam(arguments[0]);
    if (process.chastity == undefined) {
		process.chastity = {};
	}
    if (process.chastity[serverID] == undefined) {
        process.chastity[serverID] = {};
    }
	let ownedkeys = [];
	Object.keys(process.chastity[serverID]).forEach((k) => {
		if (process.chastity[serverID][k].keyholder == userID) {
			if (process.chastity[serverID][k].clonedKeyholders) {
				process.chastity[serverID][k].clonedKeyholders.forEach((c) => {
					ownedkeys.push(`${k}_${c}`);
				});
			}
		}
	});
	return ownedkeys;
}

exports.getOtherKeysChastity = getOtherKeysChastity;