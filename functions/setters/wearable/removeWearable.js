const { getLockedWearable } = require("../../getters/wearable/getLockedWearable");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Removes a clothing from the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the clothing
 * - (string) wearable - The type of clothing to remove
 * ---
 * ##### *No return value*
 **********/
function deleteWearable(serverID, userID, wearable) {
    traceFirstParam(arguments[0]);
    if (process.wearable == undefined) {
        process.wearable = {};
    }
    if (process.wearable[serverID] == undefined) {
        process.wearable[serverID] = {};
    }
    if (!process.wearable[serverID][userID]) {
        return false;
    }
    if (wearable && process.wearable[serverID][userID].wornwearable.includes(wearable) && !getLockedWearable(serverID, userID).includes(wearable)) {
        process.wearable[serverID][userID].wornwearable.splice(process.wearable[serverID][userID].wornwearable.indexOf(wearable), 1);
        if (process.wearable[serverID][userID].wornwearable.length == 0) {
            delete process.wearable[serverID][userID];
        }
    } else if (process.wearable[serverID][userID]) {
        let locks = getLockedWearable(serverID, userID);
        let savedheadgear = [];
        process.wearable[serverID][userID].wornwearable.forEach((g) => {
            if (locks.includes(g)) {
                savedheadgear.push(g);
            }
        });
        process.wearable[serverID][userID].wornwearable = savedheadgear;
        if (process.wearable[serverID][userID].wornwearable.length == 0) {
            delete process.wearable[serverID][userID];
        }
    }
    markForSave("wearable");
}

exports.deleteWearable = deleteWearable;
exports.removeWearable = deleteWearable;
