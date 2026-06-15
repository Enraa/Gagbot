/*********
 * Generates an array with users mapped to their count in a stat. 
 * ##### This is not sorted, presented as [userid, stat]. Sort with .sort((a,b) => { return a[1] - b[1]})
 * 
 * - (string) stat - The stat to pull all of. ]
 * ---
 * ##### Returns an array with array pairs of user IDs and stats, [userid, stat]
 *********/
function statsGetAllStat(stat) {
    let selectedoption = [];
    if (process.userstats) {
        Object.keys(process.userstats).forEach((user) => {
            if ((process.userstats[user] && process.userstats[user][stat])) {
                if ((typeof process.userstats[user][stat] == "number")) {
                    if (process.userstats[user][stat] > 0) {
                        selectedoption.push([user, process.userstats[user][stat]])
                    }
                }
                else {
                    selectedoption.push([user, process.userstats[user][stat]])
                }
            }
        })
    }
    return selectedoption;
}

exports.statsGetAllStat = statsGetAllStat;