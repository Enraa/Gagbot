const { getBaseHeadwear } = require("../../getters/headwear/getBaseHeadwear");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Adds or modifies a headwear on the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the headgear
 * - (string) headwear - Headwear item ID
 * - (user id) origbinder - The person doing the action
 * ---
 * ##### *No return value*
 **********/
function assignHeadwear(serverID, userID, headwear, origbinder) {
    traceFirstParam(arguments[0]);
    if (process.headwear == undefined) {
        process.headwear = {};
    }
    if (process.headwear[serverID] == undefined) {
        process.headwear[serverID] = {};
    }
    let originalbinder = process.headwear[serverID][userID]?.origbinder;
    if (process.headwear[serverID][userID]) {
        process.headwear[serverID][userID].wornheadwear.push(headwear);
    } else {
        process.headwear[serverID][userID] = { wornheadwear: [headwear], origbinder: originalbinder ?? origbinder };
    }
    originalbinder = ((process.headwear[serverID][userID] && process.headwear[serverID][userID][headwear] && process.headwear[serverID][userID][headwear].origbinder) ?? origbinder) ?? userID;
    process.headwear[serverID][userID][headwear] = { 
        origbinder: originalbinder ?? userID,
        lockable: getBaseHeadwear(headwear).lockable
    }
    // Increment the worn corset counter
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[serverID] == undefined) { process.userstats[serverID] = {} }
    if (process.userstats[serverID][userID] == undefined) { process.userstats[serverID][userID] = {} }

    process.userstats[serverID][userID].wornmasks = (process.userstats[serverID][userID].wornmasks ?? 0) + 1;
    
    markForSave("headwear");
    markForSave("userstats");
};

exports.assignHeadwear = assignHeadwear;