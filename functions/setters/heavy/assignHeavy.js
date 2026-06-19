const { getHeavyName } = require("../../getters/heavy/getHeavyName");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**************
 * Adds a heavy bondage to a user. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user to wear the heavy bondage
 * - (string) type - The specific heavy bondage type
 * - (user id) origbinder - The person applying the heavy bondage
 * - (string) customname - The name to apply to the heavy bondage object
 * ---
 * ##### *No return value*
 **************/
function assignHeavy(serverID, user, type, origbinder, customname) {
    traceFirstParam(arguments[0]);
    let namedcontainerowner;
    if ((type === "dominants_lap") || (type === "engulfing_slime")) {
        namedcontainerowner = origbinder;
    }
    if (process.heavy == undefined) {
        process.heavy = {};
    }
    if (process.heavy[serverID] == undefined) {
        process.heavy[serverID] = {};
    }
    if (process.heavy[serverID][user] == undefined) {
        process.heavy[serverID][user] = [];
    }
    if (process.heavy[serverID][user].length > 0) {
        let existingheavy = process.heavy[serverID][user].find((h) => h.type === type)
        if (existingheavy) {
            existingheavy.origbinder = origbinder;
            existingheavy.displayname = customname ?? getHeavyName(type);
            existingheavy.namedcontainerowner = namedcontainerowner;
        }
        else {
            process.heavy[serverID][user].push({
                type: type,
                origbinder: origbinder,
                displayname: customname ?? getHeavyName(type),
                namedcontainerowner: namedcontainerowner
            })
        }
    }
    else {
        process.heavy[serverID][user].push({
            type: type,
            origbinder: origbinder,
            displayname: customname ?? getHeavyName(type),
            namedcontainerowner: namedcontainerowner
        })
    }

    // Increment the worn heavy bondage counter
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[serverID] == undefined) { process.userstats[serverID] = {} }
    if (process.userstats[serverID][user] == undefined) { process.userstats[serverID][user] = {} }

    process.userstats[serverID][user].wornheavy = (process.userstats[serverID][user].wornheavy ?? 0) + 1;
    
    markForSave("heavy");
    markForSave("userstats");
};

exports.assignHeavy = assignHeavy;