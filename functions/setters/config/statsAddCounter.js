const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Adds a point to a counter by name in user's stats. Specify amount for custom amount.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to increment
 * - (number) amount - Amount to increment the counter by. Default to 1
 * ---
 * ##### *No return value*
 **********/
function statsAddCounter(serverID, user, countername, amount = 1) {
    traceFirstParam(arguments[0]);
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[serverID] == undefined) { process.userstats[serverID] = {} }
    if (process.userstats[serverID][user] == undefined) { process.userstats[serverID][user] = {} }
    let newcount = (process.userstats[serverID][user][countername] ?? 0) + amount;
    process.userstats[serverID][user][countername] = newcount;
    markForSave("userstats");
}

exports.statsAddCounter = statsAddCounter