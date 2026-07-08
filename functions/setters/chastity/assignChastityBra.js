const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Adds or modifies a chastity bra on the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The person wearing the chastity bra
 * - (user id) keyholder - The person putting the chastity bra on them
 * - (string) namedchastity? - The chastity item ID, if any
 * - (boolean) force - If true, forcibly puts this chastity bra on
 * ---
 * ##### Returns true if successful, false if failed to put it on
 **********/
function assignChastityBra(serverID, user, keyholder, namedchastity, force = false) {
    traceFirstParam(arguments[0]);
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
    if (process.chastitybra[serverID] == undefined) {
		process.chastitybra[serverID] = {};
	}
    // Get the current and new bases to reference
    let oldchastitybase = getChastityBra(serverID, user) ? getBaseChastity(getChastityBra(serverID, user).chastitytype) : undefined
    let newchastitybase = getBaseChastity(namedchastity ?? "bra_silver")

    // Stop this function immediately if the current chastity belt can't be removed. 
    // If there is none worn, no worries! 
    if ((oldchastitybase && !oldchastitybase.canUnequip({ serverID: serverID, userID: user, keyholderID: keyholder })) && !force) { return false };

    // Determine any existing keyholders on this chastity belt, if any. 
    let clonedkeyholders = getChastityBra(serverID, user)?.clonedKeyholders;

    // Call the on unequip for existing chastity if relevant. 
    if (oldchastitybase) { oldchastitybase.onUnequip({ serverID: serverID, userID: user, keyholderID: keyholder }) }

    // Assign the new chastity belt to the user
	process.chastitybra[serverID][user] = { keyholder: keyholder ? keyholder : "unlocked", timestamp: Date.now(), chastitytype: namedchastity, stateligible: true, clonedKeyholders: clonedkeyholders };

    // Call the on equip for the new chastity belt!
    newchastitybase.onEquip({ serverID: serverID, userID: user, keyholderID: keyholder })

    markForSave("chastitybra");
	return true;
};

exports.assignChastityBra = assignChastityBra;