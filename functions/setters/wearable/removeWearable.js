const { getLockedWearable } = require("../../getters/wearable/getLockedWearable");
const { markForSave } = require("../../other/markForSave");

/**********
 * Removes a clothing from the user.
 * 
 * - (user id) userID - The person wearing the clothing
 * - (string) wearable - The type of clothing to remove
 * ---
 * ##### *No return value*
 **********/
function deleteWearable(userID, wearable) {
    if (process.wearable == undefined) {
        process.wearable = {};
    }
    if (!process.wearable[userID]) {
        return false;
    }
    if (wearable && process.wearable[userID].wornwearable.includes(wearable) && !getLockedWearable(userID).includes(wearable)) {
        process.wearable[userID].wornwearable.splice(process.wearable[userID].wornwearable.indexOf(wearable), 1);
        if (process.wearable[userID].wornwearable.length == 0) {
            delete process.wearable[userID];
        }
    } else if (process.wearable[userID]) {
        let locks = getLockedWearable(userID);
        let savedheadgear = [];
        process.wearable[userID].wornwearable.forEach((g) => {
            if (locks.includes(g)) {
                savedheadgear.push(g);
            }
        });
        process.wearable[userID].wornwearable = savedheadgear;
        if (process.wearable[userID].wornwearable.length == 0) {
            delete process.wearable[userID];
        }
    }
    markForSave("wearable");
}

exports.deleteWearable = deleteWearable;
exports.removeWearable = deleteWearable;
