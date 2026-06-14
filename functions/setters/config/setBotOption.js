/********
 * Sets the global option for the bot
 *
 * - (string) option - The string name of the config option
 * - (any) choice - The value to set to the option
 * ---
 * ##### *No return value*
 ********/
function setBotOption(option, choice) {
	if (process.configs == undefined) {
		process.configs = {};
	}
	if (process.configs.botglobal == undefined) {
		process.configs.botglobal = {};
	}
	process.configs.botglobal[option] = choice;
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.configs = true;
}

exports.setBotOption = setBotOption;