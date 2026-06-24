const { getChastity } = require("../../getters/chastity/getChastity");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Adds a user as a cloned keyholder for the chastity belt
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) chastityuser - The user wearing the chastity belt
 * - (user id) newKeyholder - The user added to the chastity belt's cloned keys
 * ---
 * ##### *No return value*
 ********/
function cloneChastityKey(serverID, chastityuser, newKeyholder) {
    traceFirstParam(arguments[0]);
    let chastity = getChastity(serverID, chastityuser);
    if (!chastity.clonedKeyholders) {
        chastity.clonedKeyholders = [];
    }
    markForSave("chastity");
};

exports.cloneChastityKey = cloneChastityKey;