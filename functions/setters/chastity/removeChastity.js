const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastity } = require("../../getters/chastity/getChastity");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Removes a chastity belt from the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The person wearing the chastity belt
 * - (user id) keyholder - The person removing the chastity belt from them
 * - (boolean) force - If true, forcibly removes this chastity belt
 * ---
 * ##### Returns true if successful, false if failed to remove
 * ---
 * ##### Fix the timestamp so that it determines the longer timestamp when recording longest chastity!
 **********/
function removeChastity(serverID, user, keyholder, force = false) {
    traceFirstParam(arguments[0]);
	if (process.chastity == undefined) {
		process.chastity = {};
    }
    if (process.chastity[serverID] == undefined) {
		process.chastity[serverID] = {};
    }
    let chastitybase = getBaseChastity(getChastity(serverID, user)?.chastitytype ?? "belt_silver")

	if ((chastitybase && !chastitybase.canUnequip({ serverID: serverID, userID: user, keyholderID: keyholder })) && !force) return false;

	chastitybase.onUnequip({ serverID: serverID, userID: user });

    if (process.chastity[serverID][user]?.stateligible) {
        if (process.userstats == undefined) { process.userstats = {} }
        if (process.userstats[serverID] == undefined) { process.userstats = {} }
        if (process.userstats[serverID][user] == undefined) { process.userstats[serverID][user] = {} }
        process.userstats[serverID][user].chastitywornduration = (Date.now() - process.chastity[serverID][user].timestamp)
        markForSave("userstats");
    }

	delete process.chastity[serverID][user];
	markForSave("chastity");

	return true;
};

exports.removeChastity = removeChastity;