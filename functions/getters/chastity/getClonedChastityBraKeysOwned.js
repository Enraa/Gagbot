const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/***********
 * Gets a list of cloned chastity bra keys the user is holding. 
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The user to check held keys
 * ---
 * ##### Returns an array of held cloned chastity bra keys in the format "0000000000000000_chastitybra"
 ***********/
function getClonedChastityBraKeysOwned(serverID, userID) {
    traceFirstParam(arguments[0]);
    if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
    if (process.chastitybra[serverID] == undefined) {
        process.chastitybra[serverID] = {};
    }
	let ownedkeys = [];
	Object.keys(process.chastitybra[serverID]).forEach((k) => {
		if (process.chastitybra[serverID][k].clonedKeyholders) {
			if (process.chastitybra[serverID][k].clonedKeyholders.includes(userID)) {
				ownedkeys.push(`${k}_chastitybra`);
			}
		}
	});
	return ownedkeys;
}

exports.getClonedChastityBraKeysOwned = getClonedChastityBraKeysOwned;