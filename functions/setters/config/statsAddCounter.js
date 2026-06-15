const { markForSave } = require("../../other/markForSave");

/**********
 * Adds a point to a counter by name in user's stats. Specify amount for custom amount.
 * 
 * - (user id) user - User to increment for
 * - (string) countername - ID of the counter to increment
 * - (number) amount - Amount to increment the counter by. Default to 1
 * ---
 * ##### *No return value*
 **********/
function statsAddCounter(user, countername, amount = 1) {
    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[user] == undefined) { process.userstats[user] = {} }
    let newcount = (process.userstats[user][countername] ?? 0) + amount;
    process.userstats[user][countername] = newcount;
    markForSave("userstats");
}

exports.statsAddCounter = statsAddCounter