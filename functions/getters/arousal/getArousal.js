/*********
 * Gets the user's current arousal
 * 
 * - (user id) user - The user who is aroused
 * ---
 * ##### Returns a float representing the user's current arousal, or 0.
 */
function getArousal(user) {
	return process.arousal[user]?.arousal ?? 0;
}

exports.getArousal = getArousal;