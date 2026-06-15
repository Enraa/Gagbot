const { configoptions } = require("../../lists/configoptions");
const { markForSave } = require("./markForSave");

/**********
 * Sets all options to the defaults for a server. 
 * 
 * - (server id) serverID - The server to set defaults for
 * ---
 * ##### *No return value*
 **********/
function initializeServerOptions(serverID) {
    if (process.configs == undefined) {
        process.configs = {};
    }
    if (process.configs.servers == undefined) {
        process.configs.servers = {};
    }
    if (process.configs.servers[serverID] == undefined) {
        process.configs.servers[serverID] = {};
    }
    Object.keys(configoptions["Server"]).forEach((k) => {
        process.configs.servers[serverID][k] = configoptions["Server"][k].default;
    });
    markForSave("configs");
}

exports.initializeServerOptions = initializeServerOptions;