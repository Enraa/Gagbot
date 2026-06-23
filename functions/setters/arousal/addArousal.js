const { getArousal } = require("../../getters/arousal/getArousal");
const { getCombinedTraits } = require("../../getters/chastity/getCombinedTraits");
const { getOption } = require("../../getters/config/getOption");
const { getProcessVariable } = require("../../getters/config/getProcessVariable");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Adds arousal to the user. Will set users with disabled arousal to 0.
 * 
 * - (server id) serverID - The server this is on
 * - (user id) user - The user to add the arousal to
 * - (float) change - The amount to change their arousal by. Can be negative
 * ---
 * ##### Returns current arousal after change
 **********/
function addArousal(serverID, user, change) {
    traceFirstParam(arguments[0]);
    if (!getProcessVariable(serverID, user, "arousal")) process.arousal[serverID][user] = { arousal: 0, prev: 0, timestamp: Date.now() };
    if (getOption(serverID, user, "arousalsystem") == 0) { 
        process.arousal[serverID][user] = { arousal: 0, prev: 0, timestamp: Date.now() }
        return 0; // If they turned off arousal, do NOT do anything with them, just set it to zero. 
    }
    if (isNaN(change)) {
        console.log(`ERROR - Attempting to add a NaN arousal to user ID ${user}`)
        change = 0; // set it to 0
    }
    process.arousal[serverID][user].arousal += change;
    if (isNaN(getArousal(serverID, user))) {
        console.log(`ERROR - ${user} is somehow not a number!`)
        process.arousal[serverID][user].arousal = 0;
    }
    getCombinedTraits(serverID, user).afterArousalChange({ serverID: serverID, userID: user, prevArousal: (getArousal(serverID, user) - change), currArousal: getArousal(serverID, user) });
    return getArousal(serverID, user);
}

exports.addArousal = addArousal;