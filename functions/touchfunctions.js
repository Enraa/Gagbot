const { getCollar } = require("./collarfunctions");
const { getGags, getMitten } = require("./gagfunctions");
const { getHeadwearRestrictions, getHeadwear } = require("./headwearfunctions");
const { getHeavyRestrictions, getHeavy } = require("./heavyfunctions");
const { getToys } = require("./toyfunctions");
const { getWearable } = require("./wearablefunctions");

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
    let critaccuracy = 0.05;
    critaccuracy = critaccuracy + Math.min(process.headpatcritchancebonus, 0.20);
    
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
    if ((userheavyrestrictions && userheavyrestrictions.touchself) && (user == target)) {
        hitaccuracy = 1.0;
    }

    returnedobject.hit = (Math.random() <= hitaccuracy)
    if (returnedobject.hit) {
        returnedobject.crit = (Math.random() <= critaccuracy)
        returnedobject.boundmiss = undefined;
        process.headpatcritchancebonus = 0.0;
    }

    // Do all of the functions for the person receiving the headpats.
    // Note, within the function we need to check if headpat was successful! 
    doHeadpatFunctions(user, target, returnedobject)

    return returnedobject;
}

// This should definitely be refactored. 
function doHeadpatFunctions(headpatter, recipient, returnedobject) {
	// Gags
	if (process.gags) {
        getGags(recipient).forEach((g) => {
            if (process.headpatfunctions.gags && process.headpatfunctions.gags[g.gagtype]) {
                process.headpatfunctions.gags[g.gagtype](recipient, headpatter, returnedobject);
            }
        });
	}
	// Headwear
	if (process.headwear) {
        getHeadwear(recipient).forEach((h) => {
            if (process.headpatfunctions.headwear && process.headpatfunctions.headwear[h]) {
                process.headpatfunctions.headwear[h](recipient, headpatter, returnedobject);
            }
        });
	}
	// Mittens
	if (process.mitten) {
        if (getMitten(recipient)) {
            if (process.headpatfunctions.mitten && process.headpatfunctions.mitten[getMitten(recipient).mittenname]) {
                process.headpatfunctions.mitten[getMitten(recipient).mittenname](recipient, headpatter, returnedobject);
            }
        }
	}
	// Heavy Bondage
	if (process.heavy) {
        if (getHeavy(recipient)) {
            if (process.headpatfunctions.heavy && process.headpatfunctions.heavy[getHeavy(recipient).typeval]) {
                process.headpatfunctions.heavy[getHeavy(recipient).typeval](recipient, headpatter, returnedobject);
            }
        }
	}
	// Wearables
	if (process.wearable) {
        getWearable(recipient).forEach((h) => {
            if (process.headpatfunctions.wearable && process.headpatfunctions.wearable[h]) {
                process.headpatfunctions.wearable[h](recipient, headpatter, returnedobject);
            }
        });
	}
    // Toys
    if (process.toys) {
        getToys(recipient).forEach((h) => {
            if (process.headpatfunctions.toys && process.headpatfunctions.toys[h.type]) {
                process.headpatfunctions.toys[h.type](recipient, headpatter, returnedobject);
            }
        });
	}
    // Collars
    if (process.collar) {
        if (getCollar(recipient)) {
            if (process.headpatfunctions.collar && process.headpatfunctions.collar[getCollar(recipient).collartype]) {
                process.headpatfunctions.collar[getCollar(recipient).collartype](recipient, headpatter, returnedobject);
            }
        }
	}
}

exports.rollPatChance = rollPatChance;