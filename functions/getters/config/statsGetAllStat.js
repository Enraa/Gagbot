const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*********
 * Generates an array with users mapped to their count in a stat. 
 * ##### This is not sorted, presented as [userid, stat]. Sort with .sort((a,b) => { return a[1] - b[1]})
 * 
 * - (server id) serverID - The server this is running on
 * - (string) stat - The stat to pull all of. ]
 * ---
 * ##### Returns an array with array pairs of user IDs and stats, [userid, stat]
 *********/
function statsGetAllStat(serverID, stat) {
    traceFirstParam(arguments[0]);
    let selectedoption = [];
    if (process.userstats && process.userstats[serverID]) {
        Object.keys(process.userstats[serverID]).forEach((user) => {
            if ((process.userstats[serverID][user] && process.userstats[serverID][user][stat])) {
                if ((typeof process.userstats[serverID][user][stat] == "number")) {
                    if (process.userstats[serverID][user][stat] > 0) {
                        selectedoption.push([user, process.userstats[serverID][user][stat]])
                    }
                }
                else {
                    selectedoption.push([user, process.userstats[serverID][user][stat]])
                }
            }
        })
    }
    return selectedoption;
}

exports.statsGetAllStat = statsGetAllStat;