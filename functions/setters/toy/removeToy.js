const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Removes a toy from the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the toy
 * - (user id) keyholder - The person removing the toy
 * - (string) toytype - The toy ID to remove
 * - (boolean) force - If true, removes all toys
 * ---
 * ##### *No return value*
 **********/
function removeToy(serverID, user, keyholder, toytype, force = false) {
    traceFirstParam(arguments[0]);
    if (process.toys == undefined) { process.toys = {} }
    if (process.toys[serverID] == undefined) { process.toys[serverID] = {} }
    if (process.toys[serverID][user] == undefined) { process.toys[serverID][user] = [] }
    let index = process.toys[serverID][user].findIndex((toy) => toy.type == toytype)
    if (index > -1) {
        let vibe = process.toytypes[toytype];
        if (vibe && vibe.blocker({ serverID: serverID, userID: user }) && getBaseChastity(vibe.blocker({ serverID: serverID, userID: user }).chastitytype)) {
            getBaseChastity(vibe.blocker({ serverID: serverID, userID: user }).chastitytype).onToyChange({ serverID: serverID, userID: user, keyholderID: keyholder ?? user, currentToys: process.toys[serverID][user], newToy: { type: toytype, intensity: vibe.intensity, origbinder: vibe.origbinder }, action: "remove"})
        } 
        if (vibe && vibe.onUnequip) {
            vibe.onUnequip({ serverID: serverID, userID: user });
        }
        process.toys[serverID][user].splice(index, 1);
    }
    if (force) { delete process.toys[serverID][user] }
    markForSave("toys");
}

exports.removeToy = removeToy;