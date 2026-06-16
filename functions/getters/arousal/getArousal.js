const { getProcessVariable } = require("../config/getProcessVariable");

/*********
 * Gets the user's current arousal
 * 
 * - (server id) serverID - The server this is on
 * - (user id) user - The user who is aroused
 * ---
 * ##### Returns a float representing the user's current arousal, or 0.
 */
function getArousal(serverID, user) {
	return getProcessVariable(serverID, user, "arousal").arousal ?? 0;
}

exports.getArousal = getArousal;