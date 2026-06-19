const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastity } = require("../../getters/chastity/getChastity");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/***********
 * Changes a chastity belt on the user in place
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user wearing the chastity belt
 * - (user id) keyholder - The user trying to change the belt
 * - (string) namedchastity - The chastity belt ID to change to
 * ---
 * ##### Returns true if successful, false if unable to change
 ***********/
function swapChastity(serverID, user, keyholder, namedchastity) {
    traceFirstParam(arguments[0]);
	if (process.chastity == undefined) {
		process.chastity = {};
	}
    if (process.chastity[serverID] == undefined) {
		process.chastity[serverID] = {};
	}
    let chastitybase = getBaseChastity(getChastity(serverID, user).chastitytype ?? "belt_silver")
	if (chastitybase && !chastitybase.canUnequip({ serverID: serverID, userID: user, keyholderID: keyholder })) return false;
	chastitybase.onUnequip({ serverID: serverID, userID: user });
	process.chastity[serverID][user].chastitytype = namedchastity;
	let newchastitybase = getBaseChastity(namedchastity)
	newchastitybase.onEquip({ serverID: serverID, userID: user });
	markForSave("chastity");
	return true;
}

exports.swapChastity = swapChastity;