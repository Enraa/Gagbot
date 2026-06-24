const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/********
 * Gets the person who put a piece of headwear on the user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the headgear
 * - (string) item - The item ID to check 
 * ---
 * ##### Returns the user ID who put this headgear on the wearer
 ********/
function getHeadwearBinder(serverID, userID, item) {
    traceFirstParam(arguments[0]);
	return (getProcessVariable(serverID, userID, "headwear") && getProcessVariable(serverID, userID, "headwear")[item] && getProcessVariable(serverID, userID, "headwear")[item]?.origbinder);
}

exports.getHeadwearBinder = getHeadwearBinder;