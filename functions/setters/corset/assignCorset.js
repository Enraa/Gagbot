const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastity } = require("../../getters/chastity/getChastity");
const { getBaseCorset } = require("../../getters/corset/getBaseCorset");
const { getBreath } = require("../../getters/corset/getBreath");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Adds or modifies a corset on the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The person wearing the corset
 * - (string) type - The type of corset applied to the wearer
 * - (integer) tightness - How tight the corset should be (1-10)
 * - (user id) origbinder - Who's adding/modifying the corset
 * ---
 * ##### *No return value*
 **********/
function assignCorset(serverID, user, type, tightness, origbinder) {
    traceFirstParam(arguments[0]);
	if (process.corset == undefined) process.corset = {};
    if (process.corset[serverID] == undefined) process.corset[serverID] = {};
	const old = Object.assign({}, process.corset[serverID][user]);
	const currentBreath = process.corset[serverID][user] ? getBreath(serverID, user) : null;
	let originalbinder = old?.origbinder;
	if (old && old.type != type) {
		// Call the unequip function on the old corset
		getBaseCorset(old?.type)?.onUnequip({ serverID: serverID, userID: user, oldcorset: old });
	}
	const newMaxBreath = getBaseCorset(type)?.getMaxBreath({ tightness: 0 }) ?? getBaseCorset("corset_leather").getMaxBreath({ tightness: 0 });
	process.corset[serverID][user] = {
		tightness: tightness ?? old?.tightness ?? 5,
		breath: currentBreath ? Math.min(currentBreath, newMaxBreath) : newMaxBreath,
		timestamp: Date.now(),
		origbinder: originalbinder ?? origbinder, // Preserve original binder until it is removed.
		type: type,
	};
	if (old.type == type) {
		getBaseCorset(old?.type)?.onAdjustTightness({ serverID: serverID, userID: user, oldTightness: old.tightness, newTightness: tightness });
	}
    if (getChastity(serverID, user) && getBaseChastity(getChastity(serverID, user).chastitytype)) {
        getBaseChastity(getChastity(serverID, user).chastitytype).onCorsetChange({ serverID: serverID, userID: user, keyholderID: origbinder, oldcorset: old })
    }
	if (old.type != type) {
		getBaseCorset(type)?.onEquip({ serverID: serverID, userID: user });
	}
    // Increment the worn corset counter
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[serverID] == undefined) { process.userstats[serverID] = {} }
    if (process.userstats[serverID][user] == undefined) { process.userstats[serverID][user] = {} }

    process.userstats[serverID][user].worncorsets = (process.userstats[serverID][user].worncorsets ?? 0) + 1;

    markForSave("corset");
    markForSave("userstats");
};

exports.assignCorset = assignCorset;