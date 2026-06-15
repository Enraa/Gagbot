const { getLockedHeadgear } = require("../../getters/headwear/getLockedHeadgear");
const { markForSave } = require("../../other/markForSave");

/**********
 * Removes a headwear from the user.
 * 
 * - (user id) userID - The person wearing the headwear
 * - (string) headwear - The type of headwear to remove
 * - (boolean) force - If true, forcibly removes all headwear
 * ---
 * ##### *No return value*
 **********/
function deleteHeadwear(userID, headwear, force = true) {
    if (process.headwear == undefined) {
        process.headwear = {};
    }
    if (!process.headwear[userID]) {
        return false;
    }
    if (headwear && process.headwear[userID].wornheadwear.includes(headwear) && !getLockedHeadgear(userID).includes(headwear)) {
        if (process.headtypes[headwear] && process.headtypes[headwear].onUnlock) {
            process.headtypes[headwear].onUnlock({ userID: userID });
        }
        process.headwear[userID].wornheadwear.splice(process.headwear[userID].wornheadwear.indexOf(headwear), 1);
        delete process.headwear[userID][headwear]; // Removed origbinders for specific headgears
        if (process.headwear[userID].wornheadwear.length == 0) {
            delete process.headwear[userID];
        }
    } else if (process.headwear[userID]) {
        let locks = getLockedHeadgear(userID);
        let savedheadgear = [];
        let origbounds = {};
        process.headwear[userID].wornheadwear.forEach((g) => {
            if (locks.includes(g)) {
                savedheadgear.push(g);
                if (process.headwear[userID][g]) {
                    origbounds[g] = Object.assign({}, process.headwear[userID][g]) // deep clone the origbound object
                }
                delete process.headwear[userID][g];
            }
        });
        process.headwear[userID].wornheadwear = savedheadgear;
        Object.keys(origbounds).forEach((k) => {
            // Bring back the objects!
            process.headwear[userID][k] = origbounds[k];
        })
        if (process.headwear[userID].wornheadwear.length == 0) {
            delete process.headwear[userID];
        }
    }
    if (force) { delete process.headwear[userID] }
    markForSave("headwear");
};

exports.deleteHeadwear = deleteHeadwear;
exports.removeHeadwear = deleteHeadwear;