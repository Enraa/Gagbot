const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/*********
 * Get a list of the heavy bondage worn by the user
 * 
 * - (server id) serverID - The server this is running on 
 * - (user id) user - The user wearing the heavy bondage
 * ---
 * ##### Returns an array of all of the heavy bondage objects worn by the user. All Heavy Bondage objects have:
 * - type: The item ID of the heavy bondage
 * - origbinder: The person who applied this heavy bondage
 * - displayname: The display name of this heavy bondage
 * - namedcontainerowner?: User ID included in container checks
 *********/
function getHeavyList(serverID, user) {
    traceFirstParam(arguments[0]);
    return getProcessVariable(serverID, user, "heavy");
}

exports.getHeavyList = getHeavyList;