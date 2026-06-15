const { getChastity } = require("../../getters/chastity/getChastity");
const { markForSave } = require("../../other/markForSave");

/********
 * Changes the primary keyholder for a user's chastity belt. Removes cloned keys.
 * 
 * - (user id) lockedUser - The person wearing the chastity belt
 * - (user id) newKeyholder - The next person to hold the key
 * ---
 * ##### Returns true if successful, false if lockedUser is not wearing a chastity belt
 ********/
function transferChastityKey(lockedUser, newKeyholder) {
	if (getChastity(lockedUser)) {
		if (getChastity(lockedUser).keyholder != newKeyholder) {
			getChastity(lockedUser).keyholder = newKeyholder;
			getChastity(lockedUser).clonedKeyholders = [];
			markForSave("chastity");
			return true;
		}
	}

	return false;
}

exports.transferChastityKey = transferChastityKey;