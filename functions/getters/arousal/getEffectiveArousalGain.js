const { getArousal } = require(`./getArousal`);
const { initialcoefficient, belltightnessfactor, arousalpercentagebonus } = require(`../../../lists/arousalconsts`);
const { getTargetArousal } = require("./getTargetArousal");

/*******
 * Given a delta, returns a normalized delta, based on how close it is to the target. It will always modify by at least a percentage and can modify up above that.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is for
 * ---
 * Returns an amount equal to the modified arousal gain. 
 *******/
function getEffectiveArousalGain(serverID, userID, delta) {
    let arousaldivider = initialcoefficient // This is the amount we'll divide the incoming arousal by as our target amount. 
    // Do some math here to get targetarousalgain modifier here, if necessary

    // Next, we want to calculate the target arousal
    let arousaltarget = getTargetArousal(serverID, userID);

    // And now we divide the delta by the arousal target. If the number is ABOVE 1.0, then take the reciprocal. 
    let arousalgainpercentage = (delta / arousaltarget);
    if (arousalgainpercentage > 1.0) {
        arousalgainpercentage = Math.pow(arousalgainpercentage, -1)
    }

    // Next, add the percent bonus. 
    arousalgainpercentage = arousalgainpercentage + arousalpercentagebonus;

    if (isNaN(arousalgainpercentage)) { arousalgainpercentage = 1.0 };

    // Finally, return the delta multiplied by the percent bonus. 
    return (delta * arousalgainpercentage)
}