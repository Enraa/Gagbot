const { configoptions } = require("../../../lists/configoptions");
const { initializeServerOptions } = require("../../other/initializeServerOptions");
const { markForSave } = require("../../other/markForSave");


/*********
 * Gets the value of an option set for a server ID
 * 
 * - (server ID) serverID - The ID of the guild
 * - (string) option - The string name of the config option
 * ---
 * ##### Returns the exact value of that configured option. Will use default if server has not configured it.
 *********/
function getServerOption(serverID, option) {
    if (process.configs == undefined) {
        process.configs = {};
    }
    if (process.configs.servers == undefined) {
        process.configs.servers = {};
    }
    if (process.configs.servers[serverID] == undefined) {
        console.log("reinitting " + option);
        process.configs.servers[serverID] = {};
        initializeServerOptions(serverID);
    }
    if (process.configs.servers[serverID][option] == undefined) {
        Object.keys(configoptions["Server"]).forEach((k) => {
            if (k == option) {
                process.configs.servers[serverID][k] = configoptions["Server"][k].default;
            }
        });
        markForSave("configs");
    }
    return process.configs.servers[serverID][option];
}

exports.getServerOption = getServerOption;