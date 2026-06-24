const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Set the counter for a user by name. Specify Value
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to increment
 * - (any) value - Value to store in countername
 **********/
function statsSetCounter(serverID, user, countername, value) {
    traceFirstParam(arguments[0]);
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[serverID] == undefined) { process.userstats[serverID] = {} }
    if (process.userstats[serverID][user] == undefined) { process.userstats[serverID][user] = {} }
    process.userstats[serverID][user][countername] = value;
    markForSave("userstats");
}

exports.statsSetCounter = statsSetCounter;