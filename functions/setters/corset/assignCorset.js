const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getChastity } = require("../../getters/chastity/getChastity");
const { getBaseCorset } = require("../../getters/corset/getBaseCorset");
const { getBreath } = require("../../getters/corset/getBreath");

/**********
 * Adds or modifies a corset on the user.
 * 
 * - (user id) user - The person wearing the corset
 * - (string) type - The type of corset applied to the wearer
 * - (integer) tightness - How tight the corset should be (1-10)
 * - (user id) origbinder - Who's adding/modifying the corset
 * ---
 * ##### *No return value*
 **********/
function assignCorset(user, type, tightness, origbinder) {
	if (process.corset == undefined) process.corset = {};
	const old = Object.assign({}, process.corset[user]);
	const currentBreath = process.corset[user] ? getBreath(user) : null;
	let originalbinder = old?.origbinder;
	if (old && old.type != type) {
		// Call the unequip function on the old corset
		getBaseCorset(old?.type)?.onUnequip({ userID: user, oldcorset: old });
	}
	const newMaxBreath = getBaseCorset(type)?.getMaxBreath({ tightness: 0 }) ?? getBaseCorset("corset_leather").getMaxBreath({ tightness: 0 });
	process.corset[user] = {
		tightness: tightness ?? old?.tightness ?? 5,
		breath: currentBreath ? Math.min(currentBreath, newMaxBreath) : newMaxBreath,
		timestamp: Date.now(),
		origbinder: originalbinder ?? origbinder, // Preserve original binder until it is removed.
		type: type,
	};
	if (old.type == type) {
		getBaseCorset(old?.type)?.onAdjustTightness({ userID: user, oldTightness: old.tightness, newTightness: tightness });
	}
    if (getChastity(user) && getBaseChastity(getChastity(user).chastitytype)) {
        getBaseChastity(getChastity(user).chastitytype).onCorsetChange({ userID: user, keyholderID: origbinder, oldcorset: old })
    }
	if (old.type != type) {
		getBaseCorset(type)?.onEquip({ userID: user });
	}
    // Increment the worn corset counter
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }

    process.userstats[user].worncorsets = (process.userstats[user].worncorsets ?? 0) + 1;

	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.corset = true;
    process.readytosave.userstats = true;
};

exports.assignCorset = assignCorset;