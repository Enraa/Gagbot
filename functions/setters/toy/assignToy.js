const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getOption } = require("../../getters/config/getOption");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Adds or modifies a toy on the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the toy 
 * - (user id) keyholder - The person putting the toy on the user
 * - (integer) intensity - The strength of the toy
 * - (string) toytype - The type of mittens applied to the wearer
 * - (user id) origbinder - The person putting the toy on the user
 * ---
 * ##### Returns "Success" if applied a toy, "NoModify" if blocked from modifying, "NoEquip" if blocked from equipping
 * ---
 * ###### Needs cleanup and review on the origbinder param
 **********/
function assignToy(serverID, user, keyholder, intensity, toytype = "vibe_bullet", origbinder) {
    traceFirstParam(arguments[0]);
    let vibe = process.toytypes[toytype];
    if (!vibe) { return "NoToy" }
    if ((getOption(serverID, user, "arousalsystem") == 0) && (vibe.isArousing())) {
        return "NoArousal"; // Do not add a toy that can increase arousal, thats bad. 
    }
    if (process.toys == undefined) { process.toys = {} }
    if (process.toys[serverID] == undefined) { process.toys[serverID] = {} }
    if (process.toys[serverID][user] == undefined) { process.toys[serverID][user] = [] }
    let toy = process.toys[serverID][user].find((toy) => toy.type == toytype)
    // Toy already exists, modify it to the new intensity, if allowed. 
    if (toy) {
        if (vibe.canModify({ serverID: serverID, userID: user, keyholderID: keyholder ?? user })) {
            if (vibe.blocker({ serverID: serverID, userID: user }) && getBaseChastity(vibe.blocker({ serverID: serverID, userID: user }).chastitytype)) {
                getBaseChastity(vibe.blocker({ serverID: serverID, userID: user }).chastitytype).onToyChange({ serverID: serverID, userID: user, keyholderID: keyholder ?? user, currentToys: process.toys[serverID][user], newToy: { type: toytype, intensity: intensity, origbinder: origbinder }, action: "modify" })
            } 
            toy.intensity = intensity
            markForSave("toys");
            return "Success"
        }
        else {
            return "NoModify";
        }
    }
    // Toy does not exist, add it! 
    else {
        if (vibe.canEquip({ serverID: serverID, userID: user, keyholderID: keyholder ?? user })) {
            if (vibe.blocker({ serverID: serverID, userID: user }) && getBaseChastity(vibe.blocker({ serverID: serverID, userID: user }).chastitytype)) {
                getBaseChastity(vibe.blocker({ serverID: serverID, userID: user }).chastitytype).onToyChange({ serverID: serverID, userID: user, keyholderID: keyholder ?? user, currentToys: process.toys[serverID][user], newToy: { type: toytype, intensity: intensity, origbinder: origbinder }, action: "add" })
            } 
            process.toys[serverID][user].push({
                type: toytype,
                intensity: intensity,
                origbinder: origbinder
            })
            vibe.onEquip({ serverID: serverID, userID: user, intensity: intensity })
            markForSave("toys");
            return "Success"
        }
        else {
            return "NoEquip"
        }
    }
}

exports.assignToy = assignToy;