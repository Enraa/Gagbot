const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Adds a user as a cloned keyholder for the chastity bra
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) chastityuser - The user wearing the chastity bra
 * - (user id) newKeyholder - The user added to the chastity bra's cloned keys
 * ---
 * ##### *No return value*
 ********/
function cloneChastityBraKey(serverID, chastityuser, newKeyholder) {
    traceFirstParam(arguments[0]);
    let chastity = getChastityBra(serverID, chastityuser);
    if (!chastity.clonedKeyholders) {
        chastity.clonedKeyholders = [];
    }
    chastity.clonedKeyholders.push(newKeyholder);
    markForSave("chastitybra");
};

exports.cloneChastityBraKey = cloneChastityBraKey;