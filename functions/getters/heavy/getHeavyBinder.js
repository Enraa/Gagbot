const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getHeavy } = require("./getHeavy");

/********
 * Get the person who applied heavy bondage to the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The person wearing the heavy bondage
 * - (string) type - The specific heavy bondage ID. If unspecified, returns the first heavy bondage
 * ---
 * ##### Returns a user ID who put this heavy bondage on the user. 
 ********/
function getHeavyBinder(serverID, user, type) {
    traceFirstParam(arguments[0]);
    if (getHeavy(serverID, user)) {
        if (type) {
            return getHeavy(serverID, user, type)?.origbinder
        }
        else {
            return getHeavy(serverID, user)?.origbinder
        }
    };
}

exports.getHeavyBinder = getHeavyBinder;