const { getBaseChastity } = require("../../getters/chastity/getBaseChastity");
const { getOption } = require("../../getters/config/getOption");
const { markForSave } = require("../../other/markForSave");

/**********
 * Adds or modifies a toy on the user.
 * 
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
function assignToy (user, keyholder, intensity, toytype = "vibe_bullet", origbinder) {
    let vibe = process.toytypes[toytype];
    if (!vibe) { return "NoToy" }
    if ((getOption(user, "arousalsystem") == 0) && (vibe.isArousing())) {
        return "NoArousal"; // Do not add a toy that can increase arousal, thats bad. 
    }
    if (process.toys == undefined) { process.toys = {} }
    if (process.toys[user] == undefined) { process.toys[user] = [] }
    let toy = process.toys[user].find((toy) => toy.type == toytype)
    console.log(process.toys[user])
    // Toy already exists, modify it to the new intensity, if allowed. 
    if (toy) {
        if (vibe.canModify({ userID: user, keyholderID: keyholder ?? user })) {
            if (vibe.blocker({ userID: user }) && getBaseChastity(vibe.blocker({ userID: user }).chastitytype)) {
                getBaseChastity(vibe.blocker({ userID: user }).chastitytype).onToyChange({ userID: user, keyholderID: keyholder ?? user, currentToys: process.toys[user], newToy: { type: toytype, intensity: intensity, origbinder: origbinder }, action: "modify" })
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
        if (vibe.canEquip({ userID: user, keyholderID: keyholder ?? user })) {
            if (vibe.blocker({ userID: user }) && getBaseChastity(vibe.blocker({ userID: user }).chastitytype)) {
                getBaseChastity(vibe.blocker({ userID: user }).chastitytype).onToyChange({ userID: user, keyholderID: keyholder ?? user, currentToys: process.toys[user], newToy: { type: toytype, intensity: intensity, origbinder: origbinder }, action: "add" })
            } 
            process.toys[user].push({
                type: toytype,
                intensity: intensity,
                origbinder: origbinder
            })
            vibe.onEquip({ userID: user, intensity: intensity })
            markForSave("toys");
            return "Success"
        }
        else {
            return "NoEquip"
        }
    }
}

exports.assignToy = assignToy;