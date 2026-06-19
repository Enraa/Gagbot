const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Removes a collar from a user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user wearing the collar
 * ---
 * ##### *No return value*
 ********/
function removeCollar(serverID, user) {
    traceFirstParam(arguments[0]);
    if (process.collar == undefined) {
		process.collar = {};
	}
    if (process.collar[serverID] == undefined) {
		process.collar[serverID] = {};
	}
	delete process.collar[serverID][user];
	markForSave("collar");
}

exports.removeCollar = removeCollar;