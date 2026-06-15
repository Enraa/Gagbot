/**********
 * Gets all of the toys that a user is wearing
 * 
 * - (user id) user - The user wearing the toys
 * ---
 * ##### Returns an array of toy objects. All toys have the following:
 * - type: The item ID of the toy
 * - intensity: The intensity of the toy 1-20
 * - origbinder: The user ID who put the toy on the user
 **********/
function getToys(user) {
    if (process.toys == undefined) { process.toys = {} }
    if (process.toys[user] == undefined) { process.toys[user] = [] }
    return process.toys[user];
}

exports.getToys = getToys;