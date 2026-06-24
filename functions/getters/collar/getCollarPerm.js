const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getCollar } = require("./getCollar");

/********
 * Returns a boolean or undefined for perms supplied to a collar. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User ID to get the collar for
 * - (string) perm - The permission to check for
 * ---
 * ##### Returns a boolean if permission is allowed or not, or undefined if not specified.
 ********/
function getCollarPerm(serverID, user, perm) {
    traceFirstParam(arguments[0]);
    return (getCollar(serverID, user) ? getCollar(serverID, user)[perm] : undefined)
}

exports.getCollarPerm = getCollarPerm;