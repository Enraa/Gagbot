const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*******
 * Modifies the user's current Resolve, reducing it to 0 at minimum if it goes past that. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - User ID doing the Delve
 * - (integer) resolveamt - Amount of resolve to add or remove
 *******/
function modifyResolve(serverID, user, resolveamt) {
    traceFirstParam(arguments[0]);
    if (process.delveuserdata == undefined) { process.delveuserdata = {} }
    if (process.delveuserdata[serverID] == undefined) { process.delveuserdata[serverID] = {} }
    if (process.delveuserdata[serverID][user]) {
        process.delveuserdata[serverID][user].resolve = Math.max(parseInt(process.delveuserdata[serverID][user].resolve) + resolveamt, 0);
    }
}

exports.setResolve = modifyResolve;
exports.modifyResolve = modifyResolve;