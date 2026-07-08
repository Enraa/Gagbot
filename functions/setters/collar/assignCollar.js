const { getCollar } = require("../../getters/collar/getCollar");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Adds or modifies a collar on the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The person wearing the collar
 * - (user id) keyholder - The person putting the collar on them
 * - (object) restraints - The restraint bypasses (mitten, chastity, heavy, mask) permitted on the collar
 * - (boolean) only - If true, the collar will not be set to public access
 * - (string) customcollar - The collar type to wear
 * ---
 * ##### *No return value*
 **********/
function assignCollar(serverID, user, keyholder, restraints, only, customcollar) {
    traceFirstParam(arguments[0]);
    if (process.collar == undefined) {
		process.collar = {};
	}
    if (process.collar[serverID] == undefined) {
		process.collar[serverID] = {};
	}
    let existingcollar = getCollar(serverID, user)
	process.collar[serverID][user] = { 
        keyholder: keyholder, 
        keyholder_only: only, 
        mitten: restraints?.mitten, 
        chastity: restraints?.chastity, 
        heavy: restraints?.heavy, 
        mask: restraints?.mask, 
        collartype: customcollar,
        timestamp: existingcollar?.timestamp ?? Date.now(),
        additionalcollars: existingcollar?.additionalcollars,
        clonedKeyholders: existingcollar?.clonedKeyholders
    };
	markForSave("collar");
}

exports.assignCollar = assignCollar;