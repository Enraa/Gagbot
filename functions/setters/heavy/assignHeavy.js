const { getHeavyName } = require("../../getters/heavy/getHeavyName");
const { markForSave } = require("../../other/markForSave");

/**************
 * Adds a heavy bondage to a user. 
 * 
 * - (user id) user - The user to wear the heavy bondage
 * - (string) type - The specific heavy bondage type
 * - (user id) origbinder - The person applying the heavy bondage
 * - (string) customname - The name to apply to the heavy bondage object
 * ---
 * ##### *No return value*
 **************/
function assignHeavy(user, type, origbinder, customname) {
    let namedcontainerowner;
    if ((type === "dominants_lap") || (type === "engulfing_slime")) {
        namedcontainerowner = origbinder;
    }
    if (process.heavy == undefined) {
        process.heavy = {};
    }
    if (process.heavy[user] == undefined) {
        process.heavy[user] = [];
    }
    if (process.heavy[user].length > 0) {
        let existingheavy = process.heavy[user].find((h) => h.type === type)
        if (existingheavy) {
            existingheavy.origbinder = origbinder;
            existingheavy.displayname = customname ?? getHeavyName(type);
            existingheavy.namedcontainerowner = namedcontainerowner;
        }
        else {
            process.heavy[user].push({
                type: type,
                origbinder: origbinder,
                displayname: customname ?? getHeavyName(type),
                namedcontainerowner: namedcontainerowner
            })
        }
    }
    else {
        process.heavy[user].push({
            type: type,
            origbinder: origbinder,
            displayname: customname ?? getHeavyName(type),
            namedcontainerowner: namedcontainerowner
        })
    }

    // Increment the worn heavy bondage counter
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }

    process.userstats[user].wornheavy = (process.userstats[user].wornheavy ?? 0) + 1;
    
    markForSave("heavy");
    markForSave("userstats");
};

exports.assignHeavy = assignHeavy;