const { getChastityBra } = require("../../getters/chastity/getChastityBra");

/********
 * Changes the primary keyholder for a user's chastity bra. Removes cloned keys.
 * 
 * - (user id) lockedUser - The person wearing the chastity bra
 * - (user id) newKeyholder - The next person to hold the key
 * ---
 * ##### Returns true if successful, false if lockedUser is not wearing a chastity bra
 ********/
function transferChastityBraKey(lockedUser, newKeyholder) {
	if (getChastityBra(lockedUser)) {
		if (getChastityBra(lockedUser).keyholder != newKeyholder) {
			getChastityBra(lockedUser).keyholder = newKeyholder;
			getChastityBra(lockedUser).clonedKeyholders = [];
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.chastitybra = true;
			return true;
		}
	}

	return false;
}

exports.transferChastityBraKey = transferChastityBraKey;