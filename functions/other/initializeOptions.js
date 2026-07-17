const { configoptions } = require("../../lists/configoptions");
const { markForSave } = require("./markForSave");

/**********
 * Sets all options to the defaults for a user. 
 * 
 * - (server id) serverID - The server this is on
 * - (user id) userID - The user to set defaults for
 * ---
 * ##### *No return value*
 **********/
function initializeOptions(serverID, userID) {
    let pages = ["Me", "Arousal", "General", "Touch", "Restraint Options", "Extreme", "Content"];
    pages.forEach((p) => {
        let optionspages = Object.keys(configoptions[p]);
        optionspages.forEach((k) => {
            if (typeof configoptions[p][k].default == "function") {
                process.configs.users[serverID][userID][k] = configoptions[p][k].default(serverID, userID);
            } else {
                process.configs.users[serverID][userID][k] = configoptions[p][k].default;
            }
        });
    });
    markForSave("configs");
}

exports.initializeOptions = initializeOptions;