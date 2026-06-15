/**********
 * Get the counter for a user by name.
 * 
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to get
 * ---
 * ##### Returns the current value of the counter for the user
 **********/
function statsGetCounter(user, countername) {
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }
    return process.userstats[user][countername];
}

exports.statsGetCounter = statsGetCounter;