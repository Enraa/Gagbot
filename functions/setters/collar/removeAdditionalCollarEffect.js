const { getCollar } = require("../../getters/collar/getCollar");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*******
 * Removes an additional Collar effect from the user's collar, if they are wearing a collar. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user wearing the collar.
 * - (string) type - The collar effect to remove
 * ---
 * ##### *No return value*
 *******/
function removeAdditionalCollarEffect(serverID, user, type) {
    traceFirstParam(arguments[0]);
    try {
        if (getCollar(user)) {
            if (getCollar(serverID, user).additionalcollars && getCollar(serverID, user).additionalcollars.includes(type)) {
                getCollar(serverID, user).additionalcollars.splice(getCollar(serverID, user).additionalcollars.indexOf(type), 1);
            }
            if (getCollar(serverID, user).additionalcollars && getCollar(serverID, user).additionalcollars.length == 0) {
                delete getCollar(serverID, user).additionalcollars;
            }
            markForSave("collar");
        }
    }
    catch (err) {
        console.log(err)
    }
}

exports.removeAdditionalCollarEffect = removeAdditionalCollarEffect;