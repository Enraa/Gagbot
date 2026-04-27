const { getHeadwearRestrictions } = require("./headwearfunctions");
const { getHeavyRestrictions } = require("./heavyfunctions");

/****************
 * Rolls a Pat based on the user's bondage and the target's bondage. If hit is false, then boundmiss will note the reason, if it is due to the user being bound. 
 * - **(user id) user** trying to deliver the pat
 * - **(user id) target** to receive the pat
 * 
 * Returns an object with properties: 
 * - hit: Boolean 
 * - crit: Boolean
 * - boundmiss: string ("arms", "blind", "legs", "container")
*******************/
function rollPatChance(user, target) {
    let returnedobject = {
        hit: false,
        crit: false,
        boundmiss: undefined
    }
    let hitaccuracy = 0.95; // Base accuracy for successfully patting someone. This is 95% chance. 
    let critaccuracy = 0.15;
    
    // If they are in heavy bondage, we need that list. 
    let userheavyrestrictions = getHeavyRestrictions(user);
    let targetheavyrestrictions = getHeavyRestrictions(target);
    
    // Check if they are in a container. If so, they need to be in the same container to succeed. 
    // If they are not, accuracy is 0, set the boundmiss reason to container.
    if (userheavyrestrictions && userheavyrestrictions.touchlist && userheavyrestrictions.touchlist.length > 0 && !userheavyrestrictions.touchlist.includes(target)) {
        returnedobject.boundmiss = "container"
        hitaccuracy = 0.0;
    }

    // Check if their legs are bound. If so, the accuracy will go down by half. 
    if (userheavyrestrictions && userheavyrestrictions.touchself && !userheavyrestrictions.touchothers) {
        returnedobject.boundmiss = "legs"
        hitaccuracy = hitaccuracy / 2;
    }

    // Check if they are blind. If so, the accuracy will go down to 1/4. 
    if (getHeadwearRestrictions(user) && !getHeadwearRestrictions(user).canInspect) {
        returnedobject.boundmiss = "blind"
        hitaccuracy = hitaccuracy / 4;
    }

    // Check if their arms are bound. If so, the accuracy will go down to 0. 
    if (userheavyrestrictions && !userheavyrestrictions.touchself) {
        returnedobject.boundmiss = "arms"
        hitaccuracy = 0.0;
    }

    // Check if the target is blind. If so, the accuracy will be doubled.
    if (getHeadwearRestrictions(target) && !getHeadwearRestrictions(target).canInspect) {
        hitaccuracy = hitaccuracy * 2;
    }

    // Check if the target's legs are bound. If so, the accuracy will be doubled again.
    if (getHeadwearRestrictions(target) && !getHeadwearRestrictions(target).canInspect) {
        hitaccuracy = hitaccuracy * 2;
    }

    // Check if we are headpatting ourselves. If so, then accuracy should be set to 1.0, if our arms aren't bound. 
    if ((userheavyrestrictions && !userheavyrestrictions.touchself) && (user == target)) {
        hitaccuracy = 1.0;
    }

    returnedobject.hit = (Math.random() <= hitaccuracy)
    if (returnedobject.hit) {
        returnedobject.crit = (Math.random() <= critaccuracy)
        returnedobject.boundmiss = undefined;
    }

    return returnedobject;
}

exports.rollPatChance = rollPatChance;