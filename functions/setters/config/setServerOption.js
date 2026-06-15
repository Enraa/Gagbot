const { markForSave } = require("../../other/markForSave");

/********
 * Sets the configured option for the server ID as set in /config
 *
 * - (user ID) serverID - The server to modify the config of
 * - (string) option - The string name of the config option
 * - (any) choice - The value to set to the option
 * ---
 * ##### *No return value*
 ********/
function setServerOption(serverID, option, choice) {
	if (process.configs == undefined) {
		process.configs = {};
	}
	if (process.configs.servers == undefined) {
		process.configs.servers = {};
	}
	if (process.configs.servers[serverID] == undefined) {
		process.configs.servers[serverID] = {};
	}
	process.configs.servers[serverID][option] = choice;
	markForSave("configs");
}

exports.setServerOption = setServerOption;