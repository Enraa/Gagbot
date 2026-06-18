const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*********
 * Sets the user's arousal to 0
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The person to remove arousal from
 * ---
 * ##### *No return value*
 *********/
function clearArousal(serverID, user) {
    traceFirstParam(arguments[0]);
	process.arousal[serverID][user] = { arousal: 0, prev: 0, timestamp: Date.now() };
	markForSave("arousal");
}

exports.clearArousal = clearArousal;