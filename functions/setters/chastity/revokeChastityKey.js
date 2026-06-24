const { getChastity } = require("../../getters/chastity/getChastity");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*******
 * Removes a cloned key from a chastity belt
 * 
 * - (server id) serverID - The server this is running on 
 * - (user id) chastityuser - The user wearing the chastity belt
 * - (user id) newKeyholder - The user to remove from the cloned key list
 * ---
 * ##### *No return value*
 *******/
function revokeChastityKey(serverID, chastityuser, newKeyholder) {
    traceFirstParam(arguments[0]);
    let chastity = getChastity(serverID, chastityuser);
    if (!chastity.clonedKeyholders) {
        chastity.clonedKeyholders = [];
    }
    if (chastity.clonedKeyholders.includes(newKeyholder)) {
        chastity.clonedKeyholders.splice(chastity.clonedKeyholders.indexOf(newKeyholder), 1);
    }
    markForSave("chastity");
};

exports.revokeChastityKey = revokeChastityKey;