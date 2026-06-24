const { getCollar } = require("../../getters/collar/getCollar");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/******
 * Adds an additional Collar effect to the user's collar, if they are wearing a collar. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user wearing the collar.
 * - (string) type - The collar effect to add
 * ---
 * ##### *No return value*
 *******/
function addAdditionalCollarEffect(serverID, user, type) {
    traceFirstParam(arguments[0]);
    try {
        if (getCollar(serverID, user)) {
            if (!getCollar(serverID, user).additionalcollars) { getCollar(serverID, user).additionalcollars = [] }
            getCollar(serverID, user).additionalcollars.push(type)
            markForSave("collar");
        }
    }
    catch (err) {
        console.log(err);
    }
}

exports.addAdditionalCollarEffect = addAdditionalCollarEffect;