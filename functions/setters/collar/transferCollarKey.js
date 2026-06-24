const { getCollar } = require("../../getters/collar/getCollar");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Changes the primary keyholder for a user's collar. Removes cloned keys.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) lockedUser - The person wearing the collar
 * - (user id) newKeyholder - The next person to hold the key
 * ---
 * ##### Returns true if successful, false if lockedUser is not wearing a collar
 ********/
function transferCollarKey(serverID, lockedUser, newKeyholder) {
    traceFirstParam(arguments[0]);
	if (getCollar(serverID, lockedUser)) {
		if (getCollar(serverID, lockedUser).keyholder != newKeyholder) {
			getCollar(serverID, lockedUser).keyholder = newKeyholder;
			// Erase cloned keys in this process!
			getCollar(serverID, lockedUser).clonedKeyholders = [];
			markForSave("collar");
			return true;
		}
	}

	return false;
}

exports.transferCollarKey = transferCollarKey;