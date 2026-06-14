const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastityBra } = require("../../getters/chastity/getChastityBra");

/**********
 * Removes a chastity bra from the user.
 * 
 * - (user id) user - The person wearing the chastity bra
 * - (user id) keyholder - The person removing the chastity bra from them
 * - (boolean) force - If true, forcibly removes this chastity bra
 * ---
 * ##### Returns true if successful, false if failed to remove
 **********/
function removeChastityBra(user, keyholder, force = false) {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
    }
    let chastitybase = getBaseChastity(getChastityBra(user)?.chastitytype ?? "bra_silver")

	if ((chastitybase && !chastitybase.canUnequip({ userID: user, keyholderID: keyholder })) && !force) return false;

	chastitybase.onUnequip({ userID: user });

    if (process.chastitybra[user]?.stateligible) {
        if (process.userstats == undefined) { process.userstats = {} }
        if (process.userstats[user] == undefined) { process.userstats[user] = {} }
        process.userstats[user].chastitybrawornduration = (Date.now() - process.chastitybra[user].timestamp)
        if (process.readytosave == undefined) {
            process.readytosave = {};
        }
        process.readytosave.userstats = true;
    }

	delete process.chastitybra[user];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastitybra = true;

	return true;
};

exports.removeChastityBra = removeChastityBra;