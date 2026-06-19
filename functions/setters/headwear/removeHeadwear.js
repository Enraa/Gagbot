const { getLockedHeadgear } = require("../../getters/headwear/getLockedHeadgear");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Removes a headwear from the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the headwear
 * - (string) headwear - The type of headwear to remove
 * - (boolean) force - If true, forcibly removes all headwear
 * ---
 * ##### *No return value*
 **********/
function deleteHeadwear(serverID, userID, headwear, force = true) {
    traceFirstParam(arguments[0]);
    if (process.headwear == undefined) {
        process.headwear = {};
    }
    if (process.headwear[serverID] == undefined) {
        process.headwear[serverID] = {};
    }
    if (!process.headwear[serverID][userID]) {
        return false;
    }
    if (headwear && process.headwear[serverID][userID].wornheadwear.includes(headwear) && !getLockedHeadgear(serverID, userID).includes(headwear)) {
        if (process.headtypes[headwear] && process.headtypes[headwear].onUnlock) {
            process.headtypes[headwear].onUnlock({ userID: userID });
        }
        process.headwear[serverID][userID].wornheadwear.splice(process.headwear[serverID][userID].wornheadwear.indexOf(headwear), 1);
        delete process.headwear[serverID][userID][headwear]; // Removed origbinders for specific headgears
        if (process.headwear[serverID][userID].wornheadwear.length == 0) {
            delete process.headwear[serverID][userID];
        }
    } else if (process.headwear[serverID][userID]) {
        let locks = getLockedHeadgear(serverID, userID);
        let savedheadgear = [];
        let origbounds = {};
        process.headwear[serverID][userID].wornheadwear.forEach((g) => {
            if (locks.includes(g)) {
                savedheadgear.push(g);
                if (process.headwear[serverID][userID][g]) {
                    origbounds[g] = Object.assign({}, process.headwear[serverID][userID][g]) // deep clone the origbound object
                }
                delete process.headwear[serverID][userID][g];
            }
        });
        process.headwear[serverID][userID].wornheadwear = savedheadgear;
        Object.keys(origbounds).forEach((k) => {
            // Bring back the objects!
            process.headwear[serverID][userID][k] = origbounds[k];
        })
        if (process.headwear[serverID][userID].wornheadwear.length == 0) {
            delete process.headwear[serverID][userID];
        }
    }
    if (force) { delete process.headwear[serverID][userID] }
    markForSave("headwear");
};

exports.deleteHeadwear = deleteHeadwear;
exports.removeHeadwear = deleteHeadwear;