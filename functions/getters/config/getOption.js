const { configoptions } = require("../../../lists/configoptions");
const { initializeOptions } = require("../../other/initializeOptions");
const { markForSave } = require("../../other/markForSave");

/********
 * Gets the configured option for the user ID as set in /config
 *
 * - (user ID) userID - The person to check the config of
 * - (string) option - The string name of the config option
 * ---
 * ##### Returns the exact value of that configured option. Will use default if user has not configured it.
 ********/
function getOption(userID, option) {
    if (process.configs == undefined) {
        process.configs = {};
    }
    if (process.configs.users == undefined) {
        process.configs.users = {};
    }
    if (process.configs.users[userID] == undefined) {
        process.configs.users[userID] = {};
        initializeOptions(userID);
    }
    if (process.configs.users[userID][option] == undefined) {
        let pages = ["Me", "Arousal", "General", "Restraint Options", "Extreme", "Content"];
        pages.forEach((p) => {
            let optionspages = Object.keys(configoptions[p]);
            optionspages.forEach((k) => {
                if (k == option) {
                    if (typeof configoptions[p][k].default == "function") {
                        process.configs.users[userID][k] = configoptions[p][k].default(userID);
                    } else {
                        process.configs.users[userID][k] = configoptions[p][k].default;
                    }
                }
            });
        });
        markForSave("configs");
    }
    return process.configs.users[userID][option];
}

exports.getOption = getOption;