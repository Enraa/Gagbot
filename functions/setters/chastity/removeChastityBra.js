const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Removes a chastity bra from the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The person wearing the chastity bra
 * - (user id) keyholder - The person removing the chastity bra from them
 * - (boolean) force - If true, forcibly removes this chastity bra
 * ---
 * ##### Returns true if successful, false if failed to remove
 **********/
function removeChastityBra(serverID, user, keyholder, force = false) {
    traceFirstParam(arguments[0]);
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
    }
    if (process.chastitybra[serverID] == undefined) {
		process.chastitybra[serverID] = {};
    }
    let chastitybase = getBaseChastity(getChastityBra(serverID, user)?.chastitytype ?? "bra_silver")

	if ((chastitybase && !chastitybase.canUnequip({ serverID: serverID, userID: user, keyholderID: keyholder })) && !force) return false;

	chastitybase.onUnequip({ serverID: serverID, userID: user });

    if (process.chastitybra[serverID][user]?.stateligible) {
        if (process.userstats == undefined) { process.userstats = {} }
        if (process.userstats[serverID] == undefined) { process.userstats[serverID] = {} }
        if (process.userstats[serverID][user] == undefined) { process.userstats[serverID][user] = {} }
        process.userstats[serverID][user].chastitybrawornduration = (Date.now() - process.chastitybra[serverID][user].timestamp)
        markForSave("userstats");
    }

	delete process.chastitybra[serverID][user];
	markForSave("chastitybra");

	return true;
};

exports.removeChastityBra = removeChastityBra;