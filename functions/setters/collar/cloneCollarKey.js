const { getCollar } = require("../../getters/collar/getCollar");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Adds a user as a cloned keyholder for the collar
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) collarUser - The user wearing the collar
 * - (user id) newKeyholder - The user added to the collar's cloned keys
 * ---
 * ##### *No return value*
 ********/
function cloneCollarKey(serverID, collarUser, newKeyholder) {
    traceFirstParam(arguments[0]);
    let collar = getCollar(serverID, collarUser);
	if (!collar.clonedKeyholders) {
		collar.clonedKeyholders = [];
	}
	collar.clonedKeyholders.push(newKeyholder);
	markForSave("collar");
};

exports.cloneCollarKey = cloneCollarKey;