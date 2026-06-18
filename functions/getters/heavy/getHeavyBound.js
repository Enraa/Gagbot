const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getHeavy } = require("./getHeavy");
const { getHeavyRestrictions } = require("./getHeavyRestrictions");

/**********
 * Check if **user** can bind **target** by ID.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The person attempting the action
 * - (user id) target - The person receiving the action
 * ---
 * ##### Returns true if the user is able to bind the target, false if not
 **********/
function getHeavyBound(serverID, user, target) {
    traceFirstParam(arguments[0]);
    if (getHeavy(serverID, user) == undefined) {
        return true; // No need to worry, they are able to do anything!
    }
    else {
        let bound;
        let heavyrestrictions = getHeavyRestrictions(serverID, user);
        // Check if we can touch ourself
        if (user == target) {
            return heavyrestrictions.touchself;
        }
        // Check if the target user is in the same container AND we can touch others
        else if (heavyrestrictions.touchlist) {
            if (heavyrestrictions.touchlist.includes(target) && heavyrestrictions.touchothers) {
                return true;
            }
        }
        // Check if we can touch others
        else {
            return heavyrestrictions.touchothers;
        }
    }
}

exports.getHeavyBound = getHeavyBound;