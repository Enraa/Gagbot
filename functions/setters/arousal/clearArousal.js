/*********
 * Sets the user's arousal to 0
 * 
 * - (user id) user - The person to remove arousal from
 * ---
 * ##### *No return value*
 *********/
function clearArousal(user) {
	process.arousal[user] = { arousal: 0, prev: 0, timestamp: Date.now() };
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.arousal = true;
}

exports.clearArousal = clearArousal;