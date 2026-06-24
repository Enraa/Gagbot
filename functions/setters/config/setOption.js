const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Sets the configured option for the user ID as set in /config
 *
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The person to modify the config of
 * - (string) option - The string name of the config option
 * - (any) choice - The value to set to the option
 * ---
 * ##### *No return value*
 ********/
function setOption(serverID, userID, option, choice) {
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
	}
	process.configs.users[serverID][userID][option] = choice;
	markForSave("configs");
}

exports.setOption = setOption;