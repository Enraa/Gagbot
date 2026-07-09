const { getArousal } = require(`./getArousal`);
const { initialcoefficient, belltightnessfactor } = require(`../../../lists/arousalconsts`);

/**********
 * Provides the target arousal gain range given a user's current state. Factors in any restraints modifying their sensitivity as well as frustration. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is for
 * ---
 * Returns an amount where arousal gained will be 100% of the target
 **********/
function getTargetArousal(serverID, userID) {
    let arousaldivider = initialcoefficient // This is the amount we'll divide the incoming arousal by as our target amount. 
    // Do some math here to get targetarousalgain modifier here, if necessary

    // This simply returns the desired target, so divide their current arousal by the initialcoefficient
    return (Math.max(getArousal(serverID, userID) / arousaldivider, 2.0)) ?? 0.0
}

exports.getTargetArousal = getTargetArousal;