const { calcBreath } = require("../../corsetfunctions");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");


/*********
 * Gets the current breath of the user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user wearing the corset
 * ---
 * ##### Returns the calculated breath of the user
 *********/
function getBreath(serverID, user) {
    traceFirstParam(arguments[0]);
    const corset = calcBreath(serverID, user);
    markForSave("corset");
    return corset.breath;
}

exports.getBreath = getBreath;