const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/***********
 * Gets a list of cloned chastity belt keys the user is holding. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user ID) userID - The user to check held keys
 * ---
 * ##### Returns an array of held cloned chastity belt keys in the format "0000000000000000_chastitybelt"
 ***********/
function getClonedChastityKeysOwned(serverID, userID) {
    traceFirstParam(arguments[0]);
    if (process.chastity == undefined) {
		process.chastity = {};
	}
    if (process.chastity[serverID] == undefined) {
        process.chastity[serverID] = {};
    }
	let ownedkeys = [];
	Object.keys(process.chastity[serverID]).forEach((k) => {
		if (process.chastity[serverID][k].clonedKeyholders) {
			if (process.chastity[serverID][k].clonedKeyholders.includes(userID)) {
				ownedkeys.push(`${k}_chastitybelt`);
			}
		}
	});
	return ownedkeys;
}

exports.getClonedChastityKeysOwned = getClonedChastityKeysOwned;