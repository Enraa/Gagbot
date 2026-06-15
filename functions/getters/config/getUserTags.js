const { configoptions } = require("../../../lists/configoptions");
const { getOption } = require("./getOption");


/*********
 * Gets a list of tags the user has blocked or preferred
 *
 * - (user ID) userID - The user to check tags for
 * - (boolean) preferred? - If true, get a list of things the user **loves**. 
 * ---
 * ##### Returns an array of string tags to block or prefer
 *********/
function getUserTags(userID, preferred = false) {
    if (!userID) { return [] }
    let tags = [];
    let optionstocheck = Object.keys(configoptions.Content).map((t) => t.replace("wearabletags-", ""))
    optionstocheck.forEach((tag) => {
        if (getOption(userID, `wearabletags-${tag}`) == (preferred ? "preferred" : "none")) {
            tags.push(tag)
        }
    })
    return tags;
}

exports.getUserTags = getUserTags;