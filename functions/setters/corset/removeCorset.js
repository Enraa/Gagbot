const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Removes a corset from a user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user wearing the corset
 * ---
 * ##### *No return value*
 * ---
 * ##### Needs adjustment to fire the removed corset's onUnequip function
 ********/
function removeCorset(serverID, user) {
    traceFirstParam(arguments[0]);
	if (process.corset == undefined) process.corset = {};
    if (process.corset[serverID] == undefined) process.corset[serverID] = {};
	delete process.corset[serverID][user];
	markForSave("corset");
};

exports.removeCorset = removeCorset;