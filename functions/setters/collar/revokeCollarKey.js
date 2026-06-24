const { getCollar } = require("../../getters/collar/getCollar");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*******
 * Removes a cloned key from a collar
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) collarUser - The user wearing the collar
 * - (user id) newKeyholder - The user to remove from the cloned key list
 * ---
 * ##### *No return value*
 *******/
function revokeCollarKey(serverID, collarUser, newKeyholder) {
    traceFirstParam(arguments[0]);
    let collar = getCollar(serverID, collarUser);
    if (!collar.clonedKeyholders) {
        collar.clonedKeyholders = [];
    }
    if (collar.clonedKeyholders.includes(newKeyholder)) {
        collar.clonedKeyholders.splice(collar.clonedKeyholders.indexOf(newKeyholder), 1);
    }
    markForSave("collar");
};

exports.revokeCollarKey = revokeCollarKey;