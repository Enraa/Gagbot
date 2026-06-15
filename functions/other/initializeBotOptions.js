const { configoptions } = require("../../lists/configoptions");
const { markForSave } = require("./markForSave");

/**********
 * Sets all options to the defaults for the bot.
 * 
 * ---
 * ##### *No return value*
 **********/
function initializeBotOptions() {
    if (process.configs == undefined) {
        process.configs = {};
    }
    if (process.configs.botglobal == undefined) {
        process.configs.botglobal = {};
    }
    Object.keys(configoptions["Bot"]).forEach((k) => {
        process.configs.botglobal[k] = configoptions["Bot"][k].default;
    });
    markForSave("configs");
}

exports.initializeBotOptions = initializeBotOptions;