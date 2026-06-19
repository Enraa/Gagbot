const { getChastity } = require("../../getters/chastity/getChastity");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Changes the primary keyholder for a user's chastity belt. Removes cloned keys.
 * 
 * - (server id) serverID - The server this is running on 
 * - (user id) lockedUser - The person wearing the chastity belt
 * - (user id) newKeyholder - The next person to hold the key
 * ---
 * ##### Returns true if successful, false if lockedUser is not wearing a chastity belt
 ********/
function transferChastityKey(serverID, lockedUser, newKeyholder) {
    traceFirstParam(arguments[0]);
	if (getChastity(serverID, lockedUser)) {
		if (getChastity(serverID, lockedUser).keyholder != newKeyholder) {
			getChastity(serverID, lockedUser).keyholder = newKeyholder;
			getChastity(serverID, lockedUser).clonedKeyholders = [];
			markForSave("chastity");
			return true;
		}
	}

	return false;
}

exports.transferChastityKey = transferChastityKey;