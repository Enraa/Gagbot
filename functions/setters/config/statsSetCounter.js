/**********
 * Set the counter for a user by name. Specify Value
 * 
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to increment
 * - (any) value - Value to store in countername
 **********/
function statsSetCounter(user, countername, value) {
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }
    process.userstats[user][countername] = value;
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.userstats = true;
}

exports.statsSetCounter = statsSetCounter;