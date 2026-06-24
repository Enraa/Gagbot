const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Removes mittens from the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the mittens
 * ---
 * ##### *No return value*
 **********/
function deleteMitten(serverID, userID) {
    traceFirstParam(arguments[0]);
	if (process.mitten == undefined) {
		process.mitten = {};
	}
    if (process.mitten[serverID] == undefined) {
		process.mitten[serverID] = {};
	}
	delete process.mitten[serverID][userID];
	markForSave("mitten");
};

exports.deleteMitten = deleteMitten;
exports.removeMitten = deleteMitten;