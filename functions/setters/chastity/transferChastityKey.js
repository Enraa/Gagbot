/********
 * Changes the primary keyholder for a user's chastity belt. Removes cloned keys.
 * 
 * - (user id) lockedUser - The person wearing the chastity belt
 * - (user id) newKeyholder - The next person to hold the key
 * ---
 * ##### Returns true if successful, false if lockedUser is not wearing a chastity belt
 ********/
function transferChastityKey(lockedUser, newKeyholder) {
    if (process.chastity == undefined) {
		process.chastity = {};
	}
	if (process.chastity[lockedUser]) {
		if (process.chastity[lockedUser].keyholder != newKeyholder) {
			process.chastity[lockedUser].keyholder = newKeyholder;
			process.chastity[lockedUser].clonedKeyholders = [];
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.chastity = true;
			return true;
		}
	}

	return false;
}

exports.transferChastityKey = transferChastityKey;