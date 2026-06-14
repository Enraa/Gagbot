/********
 * Changes the primary keyholder for a user's collar. Removes cloned keys.
 * 
 * - (user id) lockedUser - The person wearing the collar
 * - (user id) newKeyholder - The next person to hold the key
 * ---
 * ##### Returns true if successful, false if lockedUser is not wearing a collar
 ********/
function transferCollarKey(lockedUser, newKeyholder) {
    if (process.collar == undefined) {
		process.collar = {};
	}
	if (process.collar[lockedUser]) {
		if (process.collar[lockedUser].keyholder != newKeyholder) {
			process.collar[lockedUser].keyholder = newKeyholder;
			// Erase cloned keys in this process!
			process.collar[lockedUser].clonedKeyholders = [];
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.collar = true;
			return true;
		}
	}

	return false;
}

exports.transferCollarKey = transferCollarKey;