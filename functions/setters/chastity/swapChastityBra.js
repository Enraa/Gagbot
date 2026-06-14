const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastityBra } = require("../../getters/chastity/getChastityBra");

/***********
 * Changes a chastity bra on the user in place
 * 
 * - (user id) user - The user wearing the chastity bra
 * - (user id) keyholder - The user trying to change the bra
 * - (string) namedchastity - The chastity bra ID to change to
 * ---
 * ##### Returns true if successful, false if unable to change
 ***********/
function swapChastityBra(user, keyholder, namedchastity) {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let chastitybase = getBaseChastity(getChastityBra(user).chastitytype ?? "bra_silver")
	if (chastitybase && !chastitybase.canUnequip({ userID: user, keyholderID: keyholder })) return false;
	chastitybase.onUnequip({ userID: user });
	process.chastitybra[user].chastitytype = namedchastity;
	let newchastitybase = getBaseChastity(namedchastity)
	newchastitybase.onEquip({ userID: user });
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastitybra = true; // I will need to merge all those readytosave flags into their own functions. this is a hazard to write - NBS
	return true;
}

exports.swapChastityBra = swapChastityBra;