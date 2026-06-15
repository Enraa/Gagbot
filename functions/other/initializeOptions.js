const { configoptions } = require("../../lists/configoptions");

/**********
 * Sets all options to the defaults for a user. 
 * 
 * - (user id) userID - The user to set defaults for
 * ---
 * ##### *No return value*
 **********/
function initializeOptions(userID) {
    let pages = ["Me", "Arousal", "General", "Restraint Options", "Extreme", "Content"];
    pages.forEach((p) => {
        let optionspages = Object.keys(configoptions[p]);
        optionspages.forEach((k) => {
            if (typeof configoptions[p][k].default == "function") {
                process.configs.users[userID][k] = configoptions[p][k].default(userID);
            } else {
                process.configs.users[userID][k] = configoptions[p][k].default;
            }
        });
    });
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.configs = true;
}

exports.initializeOptions = initializeOptions;