const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastity } = require("../../getters/chastity/getChastity");
const { markForSave } = require("../../other/markForSave");

/**********
 * Removes a chastity belt from the user.
 * 
 * - (user id) user - The person wearing the chastity belt
 * - (user id) keyholder - The person removing the chastity belt from them
 * - (boolean) force - If true, forcibly removes this chastity belt
 * ---
 * ##### Returns true if successful, false if failed to remove
 **********/
function removeChastity(user, keyholder, force = false) {
	if (process.chastity == undefined) {
		process.chastity = {};
    }
    let chastitybase = getBaseChastity(getChastity(user)?.chastitytype ?? "belt_silver")

	if ((chastitybase && !chastitybase.canUnequip({ userID: user, keyholderID: keyholder })) && !force) return false;

	chastitybase.onUnequip({ userID: user });

    if (process.chastity[user]?.stateligible) {
        if (process.userstats == undefined) { process.userstats = {} }
        if (process.userstats[user] == undefined) { process.userstats[user] = {} }
        process.userstats[user].chastitywornduration = (Date.now() - process.chastity[user].timestamp)
        markForSave("userstats");
    }

	delete process.chastity[user];
	markForSave("chastity");

	return true;
};

exports.removeChastity = removeChastity;