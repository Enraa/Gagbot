const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*******
 * Removes a cloned key from a chastity bra
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) chastityuser - The user wearing the chastity bra
 * - (user id) newKeyholder - The user to remove from the cloned key list
 * ---
 * ##### *No return value*
 *******/
function revokeChastityBraKey(serverID, chastityuser, newKeyholder) {
    traceFirstParam(arguments[0]);
    let chastity = getChastityBra(serverID, chastityuser);
    if (!chastity.clonedKeyholders) {
        chastity.clonedKeyholders = [];
    }
    if (chastity.clonedKeyholders.includes(newKeyholder)) {
        chastity.clonedKeyholders.splice(chastity.clonedKeyholders.indexOf(newKeyholder), 1);
    }
    markForSave("chastitybra");
};

exports.revokeChastityBraKey = revokeChastityBraKey;