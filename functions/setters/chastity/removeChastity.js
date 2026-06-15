const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastity } = require("../../getters/chastity/getChastity");

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
        if (process.readytosave == undefined) {
            process.readytosave = {};
        }
        process.readytosave.userstats = true;
    }

	delete process.chastity[user];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;

	return true;
};

exports.removeChastity = removeChastity;