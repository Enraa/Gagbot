const { getBaseHeadwear } = require("../../getters/headwear/getBaseHeadwear");

/**********
 * Adds or modifies a headwear on the user.
 * 
 * - (user id) userID - The person wearing the headgear
 * - (string) headwear - Headwear item ID
 * - (user id) origbinder - The person doing the action
 * ---
 * ##### *No return value*
 **********/
function assignHeadwear(userID, headwear, origbinder) {
    if (process.headwear == undefined) {
        process.headwear = {};
    }
    let originalbinder = process.headwear[userID]?.origbinder;
    if (process.headwear[userID]) {
        process.headwear[userID].wornheadwear.push(headwear);
    } else {
        process.headwear[userID] = { wornheadwear: [headwear], origbinder: originalbinder ?? origbinder };
    }
    originalbinder = ((process.headwear[userID] && process.headwear[userID][headwear] && process.headwear[userID][headwear].origbinder) ?? origbinder) ?? userID;
    process.headwear[userID][headwear] = { 
        origbinder: originalbinder ?? userID,
        lockable: getBaseHeadwear(headwear).lockable
    }
    // Increment the worn corset counter
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[userID] == undefined) { process.userstats[userID] = {} }

    process.userstats[userID].wornmasks = (process.userstats[userID].wornmasks ?? 0) + 1;
    
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.headwear = true;
    process.readytosave.userstats = true;
};

exports.assignHeadwear = assignHeadwear;