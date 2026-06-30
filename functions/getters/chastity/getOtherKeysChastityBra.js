const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Gets a combined list of cloned keys for chastity bras the userID is the primary keyholder for
 * 
 * - (server id) serverID - The server this is running on
 * - (user ID) userID - The primary keyholder of restraints
 * ---
 * ##### Returns an array of cloned chastity bra keys in the format "0000000000000000_00000000000000000" where the first set of 0s 
 * ##### is the person wearing the restraint, and the second set is the person holding the key clone.
 **********/
function getOtherKeysChastityBra(serverID, userID) {
    traceFirstParam(arguments[0]);
    if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
    if (process.chastitybra[serverID] == undefined) {
        process.chastitybra[serverID] = {};
    }
	let ownedkeys = [];
	Object.keys(process.chastitybra[serverID]).forEach((k) => {
		if (process.chastitybra[serverID][k].keyholder == userID) {
			if (process.chastitybra[serverID][k].clonedKeyholders) {
				process.chastitybra[serverID][k].clonedKeyholders.forEach((c) => {
					ownedkeys.push(`${k}_${c}`);
				});
			}
		}
	});
	return ownedkeys;
}

exports.getOtherKeysChastityBra = getOtherKeysChastityBra;