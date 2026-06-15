const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { markForSave } = require("../../other/markForSave");

/**********
 * Adds or modifies a chastity bra on the user.
 * 
 * - (user id) user - The person wearing the chastity bra
 * - (user id) keyholder - The person putting the chastity bra on them
 * - (string) namedchastity? - The chastity item ID, if any
 * - (boolean) force - If true, forcibly puts this chastity bra on
 * ---
 * ##### Returns true if successful, false if failed to put it on
 **********/
function assignChastityBra(user, keyholder, namedchastity, force = false) {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
    // Get the current and new bases to reference
    let oldchastitybase = getChastityBra(user) ? getBaseChastity(getChastityBra(user).chastitytype) : undefined
    let newchastitybase = getBaseChastity(namedchastity ?? "bra_silver")

    // Stop this function immediately if the current chastity belt can't be removed. 
    // If there is none worn, no worries! 
    if ((oldchastitybase && !oldchastitybase.canUnequip({ userID: user, keyholderID: keyholder })) && !force) { return false };

    // Call the on unequip for existing chastity if relevant. 
    if (oldchastitybase) { oldchastitybase.onUnequip({ userID: user, keyholderID: keyholder }) }

    // Assign the new chastity belt to the user
	process.chastitybra[user] = { keyholder: keyholder ? keyholder : "unlocked", timestamp: Date.now(), chastitytype: namedchastity, stateligible: true };

    // Call the on equip for the new chastity belt!
    newchastitybase.onEquip({ userID: user, keyholderID: keyholder })

    markForSave("chastitybra");
	return true;
};

exports.assignChastityBra = assignChastityBra;