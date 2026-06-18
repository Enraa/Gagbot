const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********************************************
 * Get a user's pronouns in typical slash format - Ex: "she/her"
 * ##### NOTE: "it/it" is grammatically correct, but repetitive. Opted for "it/its" as a stylistic choice.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user to retrieve pronouns for
 * ---
 * ##### Returns a string with the user's standard pronoun representation
 *******************************************/
const getPronounsSet = (serverID, user) => {
    traceFirstParam(arguments[0]);
	if (getProcessVariable(serverID, user, "pronouns")) {
		return `${getProcessVariable(serverID, user, "pronouns")["subject"]}/${getProcessVariable(serverID, user, "pronouns")["subject"] != "it" ? getProcessVariable(serverID, user, "pronouns")["object"] : getProcessVariable(serverID, user, "pronouns")["possessive"]}`;
	}
	return `no pronouns set`;
};

exports.getPronounsSet = getPronounsSet;