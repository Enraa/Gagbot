const { getCollar } = require("../../getters/collar/getCollar");
const { markForSave } = require("../../other/markForSave");

/********
 * Changes the primary keyholder for a user's collar. Removes cloned keys.
 * 
 * - (user id) lockedUser - The person wearing the collar
 * - (user id) newKeyholder - The next person to hold the key
 * ---
 * ##### Returns true if successful, false if lockedUser is not wearing a collar
 ********/
function transferCollarKey(lockedUser, newKeyholder) {
	if (getCollar(lockedUser)) {
		if (getCollar(lockedUser).keyholder != newKeyholder) {
			getCollar(lockedUser).keyholder = newKeyholder;
			// Erase cloned keys in this process!
			getCollar(lockedUser).clonedKeyholders = [];
			markForSave("collar");
			return true;
		}
	}

	return false;
}

exports.transferCollarKey = transferCollarKey;