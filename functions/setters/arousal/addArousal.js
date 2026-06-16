const { getArousal } = require("../../getters/arousal/getArousal");
const { getCombinedTraits } = require("../../getters/chastity/getCombinedTraits");
const { getProcessVariable } = require("../../getters/config/getProcessVariable");

/**********
 * Adds arousal to the user
 * 
 * - (server id) serverID - The server this is on
 * - (user id) user - The user to add the arousal to
 * - (float) change - The amount to change their arousal by. Can be negative
 * ---
 * ##### Returns current arousal after change
 **********/
function addArousal(arousal, user, change) {
    if (!getProcessVariable(serverID, user, "arousal")) process.arousal[serverID][user] = { arousal: 0, prev: 0, timestamp: Date.now() };
    if (isNaN(change)) {
        console.log(`ERROR - Attempting to add a NaN arousal to user ID ${user}`)
        change = 0; // set it to 0
    }
    process.arousal[user].arousal += change;
    if (isNaN(getArousal(serverID, user))) {
        console.log(`ERROR - ${user} is somehow not a number!`)
        process.arousal[user].arousal = 0;
    }
    getCombinedTraits(serverID, user).afterArousalChange({ userID: user, prevArousal: (getArousal(serverID, user) - change), currArousal: getArousal(serverID, user) });
    return getArousal(serverID, user);
}

exports.addArousal = addArousal;