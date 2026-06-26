const { getOption } = require("./getOption");

/**********
 * Given a user and an array of tags, returns true if the user has blocked any of them. 
 * 
 * - (server id) serverID - The Server this is running on
 * - (user id) userID - The user this is checking on
 * - (string | array) tags - The tags to check if the user permits. 
 * - (boolean) preferred? - If true, returns true if the user has preferred a tag and does NOT have a forbidden tag.
 * ---
 * ##### Returns true if the user has blocked any of the tags supplied, or true if the user has preferred AND not blocked any tag if preferred.
 **********/
function UserHasTags(serverID, userID, tags, preferred = false) {
    let tagsarr = tags;
    if (!Array.isArray(tags)) {
        tagsarr = [tags]
    }
    let istagged = false;
    let forceblock = false;
    tagsarr.forEach((tag) => {
        // If its on their list, istagged!
        if (getOption(serverID, userID, `wearabletags-${tag}`) == (preferred ? "preferred" : "none")) {
            istagged = true;
        }
        // If set to preferred, then if forceblock is true, it will ALWAYS return false. 
        if (getOption(serverID, userID, `wearabletags-${tag}`) == "none") {
            forceblock = true;
        }
    })
    // If we found a forbidden tag in preferred mode, no we didn't. 
    if (preferred && forceblock) {
        return false;
    }
    // If we found a tag, return true. 
    else if (istagged) {
        return true;
    }
    // Finally, we didnt find a tag that the user blocked/preferred.
    else {
        return false;
    }
}
