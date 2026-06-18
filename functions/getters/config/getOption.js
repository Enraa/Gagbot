const { configoptions } = require("../../../lists/configoptions");
const { initializeOptions } = require("../../other/initializeOptions");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Gets the configured option for the user ID as set in /config
 *
 * - (server id) serverID - The server this is on
 * - (user ID) userID - The person to check the config of
 * - (string) option - The string name of the config option
 * ---
 * ##### Returns the exact value of that configured option. Will use default if user has not configured it.
 ********/
function getOption(serverID, userID, option) {
    traceFirstParam(arguments[0]);
    if (process.configs == undefined) {
        process.configs = {};
    }
    if (process.configs.users == undefined) {
        process.configs.users = {};
    }
    if (process.configs.users[serverID] == undefined) {
        process.configs.users[serverID] = {};
    }
    if (process.configs.users[serverID][userID] == undefined) {
        process.configs.users[serverID][userID] = {};
        initializeOptions(serverID, userID);
    }
    if (process.configs.users[serverID][userID][option] == undefined) {
        let pages = ["Me", "Arousal", "General", "Restraint Options", "Extreme", "Content"];
        pages.forEach((p) => {
            let optionspages = Object.keys(configoptions[p]);
            optionspages.forEach((k) => {
                if (k == option) {
                    if (typeof configoptions[p][k].default == "function") {
                        process.configs.users[serverID][userID][k] = configoptions[p][k].default(userID);
                    } else {
                        process.configs.users[serverID][userID][k] = configoptions[p][k].default;
                    }
                }
            });
        });
        markForSave("configs");
    }
    return process.configs.users[serverID][userID][option];
}

exports.getOption = getOption;