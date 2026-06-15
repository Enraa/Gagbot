const { markForSave } = require("../../other/markForSave");

/********
 * Sets the configured option for the user ID as set in /config
 *
 * - (user ID) userID - The person to modify the config of
 * - (string) option - The string name of the config option
 * - (any) choice - The value to set to the option
 * ---
 * ##### *No return value*
 ********/
function setOption(userID, option, choice) {
	if (process.configs == undefined) {
		process.configs = {};
	}
	if (process.configs.users == undefined) {
		process.configs.users = {};
	}
	if (process.configs.users[userID] == undefined) {
		process.configs.users[userID] = {};
	}
	process.configs.users[userID][option] = choice;
	markForSave("configs");
}

exports.setOption = setOption;