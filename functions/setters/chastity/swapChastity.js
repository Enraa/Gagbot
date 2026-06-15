const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastity } = require("../../getters/chastity/getChastity");
const { markForSave } = require("../../other/markForSave");

/***********
 * Changes a chastity belt on the user in place
 * 
 * - (user id) user - The user wearing the chastity belt
 * - (user id) keyholder - The user trying to change the belt
 * - (string) namedchastity - The chastity belt ID to change to
 * ---
 * ##### Returns true if successful, false if unable to change
 ***********/
function swapChastity(user, keyholder, namedchastity) {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
    let chastitybase = getBaseChastity(getChastity(user).chastitytype ?? "belt_silver")
	if (chastitybase && !chastitybase.canUnequip({ userID: user, keyholderID: keyholder })) return false;
	chastitybase.onUnequip({ userID: user });
	process.chastity[user].chastitytype = namedchastity;
	let newchastitybase = getBaseChastity(namedchastity)
	newchastitybase.onEquip({ userID: user });
	markForSave("chastity");
	return true;
}

exports.swapChastity = swapChastity;