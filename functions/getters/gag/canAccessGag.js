const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");
const { getBaseHeadwear } = require("../headwear/getBaseHeadwear");
const { getHeadwear } = require("../headwear/getHeadwear");

/*********
 * Checks if a user's gag can be added, removed or modified, either because it is locked with a harness or they are wearing an item that prevents changing gags
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is checking
 * - (string) item? - If specified, checks if this specific gag can be modified
 * ---
 * ##### Returns true/false if the item or any gag can be modified.
 *********/
function canAccessGag(serverID, userID, item) {
    traceFirstParam(arguments[0]);
    let currentheadwearlocks = getProcessVariable(serverID, userID, "headwear") ?? {};
    let canaccess = true;

    // Check if the user is wearing a harness for that specific gag
    if (item && currentheadwearlocks[`gagharness_${item}`]) {
        canaccess = false;
    }

    // Check if the user is wearing a mask that prevents modifying gags et al
    let wornheadwear = getHeadwear(serverID, userID);
    wornheadwear.forEach((h) => {
        if (getBaseHeadwear(h).blockgag) {
            canaccess = false;
        }
    })

    return canaccess;
}

exports.canAccessGag = canAccessGag;