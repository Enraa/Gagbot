const { getArousal } = require("../../getters/arousal/getArousal");
const { getCombinedTraits } = require("../../getters/chastity/getCombinedTraits");

/**********
 * Adds arousal to the user
 * 
 * - (user id) user - The user to add the arousal to
 * - (float) change - The amount to change their arousal by. Can be negative
 * ---
 * ##### Returns current arousal after change
 **********/
function addArousal(user, change) {
    if (!process.arousal[user]) process.arousal[user] = { arousal: 0, prev: 0, timestamp: Date.now() };
    if (isNaN(change)) {
        console.log(`ERROR - Attempting to add a NaN arousal to user ID ${user}`)
        change = 0; // set it to 0
    }
    process.arousal[user].arousal += change;
    if (isNaN(getArousal(user))) {
        console.log(`ERROR - ${user} is somehow not a number!`)
        process.arousal[user].arousal = 0;
    }
    getCombinedTraits(user).afterArousalChange({ userID: user, prevArousal: (process.arousal[user].arousal - change), currArousal: process.arousal[user].arousal });
    return getArousal(user);
}

exports.addArousal = addArousal;