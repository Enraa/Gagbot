const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/***********
 * Changes a chastity bra on the user in place
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user wearing the chastity bra
 * - (user id) keyholder - The user trying to change the bra
 * - (string) namedchastity - The chastity bra ID to change to
 * ---
 * ##### Returns true if successful, false if unable to change
 ***********/
function swapChastityBra(serverID, user, keyholder, namedchastity) {
    traceFirstParam(arguments[0]);
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
    if (process.chastitybra[serverID] == undefined) {
		process.chastitybra[serverID] = {};
	}
	let chastitybase = getBaseChastity(getChastityBra(serverID, user).chastitytype ?? "bra_silver")
	if (chastitybase && !chastitybase.canUnequip({ serverID: serverID, userID: user, keyholderID: keyholder })) return false;
	chastitybase.onUnequip({ serverID: serverID, userID: user });
	process.chastitybra[serverID][user].chastitytype = namedchastity;
	let newchastitybase = getBaseChastity(namedchastity)
	newchastitybase.onEquip({ serverID: serverID, userID: user });
	markForSave("chastitybra");
	return true;
}

exports.swapChastityBra = swapChastityBra;