const { getItemTags } = require("./getItemTags");
const { getOption } = require("./getOption");

/*******
 * Given the type of restraint and restraint, returns true if the restraint is automatically allowed. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user object) user - The user doing the action
 * - (user object) target - The target receiving the action
 * - (string) type - The type of restraint
 * - (string) restraint - The item ID of the restraint
 * ---
 * ##### Returns true/false if the item is automatically accepted or not 
 *******/
function getAllowedExtreme(serverID, user, target, type, restraint) {
    let istag = ``;
    let hasOption = getOption(serverID, target.id, `extreme-${type}-${restraint}`);
    if (!hasOption) {
        // Check if we have an option tag that matches the type of restraint.
        let tags = getItemTags(restraint);
        tags.forEach((t) => {
            if (getOption(serverID, target.id, `extreme-tag-${t}`)) {
                hasOption = getOption(serverID, target.id, `extreme-tag-${t}`);
                istag = t;
            }
        })
    }
    if (!hasOption || hasOption == "Enabled" || (hasOption == "PromptOthers" && user.id == target.id)) {
        return true;
    } // Either it's Enabled, set to Prompt Others if on self, or it doesn't exist. Go away.

    if (hasOption == "Disabled") {
        return false;
    } // NOPE
}

exports.getAllowedExtreme = getAllowedExtreme;