const getBaseChastity = require("../../getters/chastity/getBaseChastity");

/**********
 * Removes a toy from the user.
 * 
 * - (user id) userID - The person wearing the toy
 * - (user id) keyholder - The person removing the toy
 * - (string) toytype - The toy ID to remove
 * - (boolean) force - If true, removes all toys
 * ---
 * ##### *No return value*
 **********/
function removeToy(user, keyholder, toytype, force = false) {
    if (process.toys == undefined) { process.toys = {} }
    if (process.toys[user] == undefined) { process.toys[user] = [] }
    let index = process.toys[user].findIndex((toy) => toy.type == toytype)
    if (index > -1) {
        let vibe = process.toytypes[toytype];
        if (vibe && vibe.blocker({ userID: user }) && getBaseChastity(vibe.blocker({ userID: user }).chastitytype)) {
            getBaseChastity(vibe.blocker({ userID: user }).chastitytype).onToyChange({ userID: user, keyholderID: keyholder ?? user, currentToys: process.toys[user], newToy: { type: toytype, intensity: vibe.intensity, origbinder: vibe.origbinder }, action: "remove"})
        } 
        if (vibe && vibe.onUnequip) {
            vibe.onUnequip({ userID: user });
        }
        process.toys[user].splice(index, 1);
    }
    if (force) { delete process.toys[user] }
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.toys = true;
}

exports.removeToy = removeToy;