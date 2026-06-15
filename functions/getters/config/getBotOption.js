const { configoptions } = require("../../../lists/configoptions");
const { initializeBotOptions } = require("../../other/initializeBotOptions");
const { markForSave } = require("../../other/markForSave");

/*********
 * Gets the value of an option set for the bot
 * 
 * - (string) option - The string name of the config option
 * ---
 * ##### Returns the exact value of that configured option. Will use default if bot has not configured it.
 *********/
function getBotOption(option) {
    if (process.configs == undefined) {
        process.configs = {};
    }
    if (process.configs.botglobal == undefined) {
        console.log("Setting up global bot settings");
        initializeBotOptions();
    }
    if (process.configs.botglobal[option] == undefined) {
        Object.keys(configoptions["Bot"]).forEach((k) => {
            if (k == option) {
                process.configs.botglobal[k] = configoptions["Bot"][k].default;
            }
        });
        markForSave("configs");
    }
    return process.configs.botglobal[option];
}

exports.getBotOption = getBotOption;