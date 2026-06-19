const { markForSave } = require("../../other/markForSave");
const { pronounsMap } = require("../../pronounfunctions");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { setOption } = require("./setOption");

/*********
 * Sets pronouns for a user
 * 
 * - (server id) serverID - The server this is on
 * - (user id) user - The person setting pronouns
 * - (string) pronouns - "she/her", "he/him", "they/them", "it/its"
 * ---
 * ##### *No return value*
 *********/
function setPronouns(serverID, user, pronouns) {
    traceFirstParam(arguments[0]);
	if (process.pronouns == undefined) {
		process.pronouns = {};
	}
    if (process.pronouns[serverID] == undefined) {
		process.pronouns[serverID] = {};
	}

	process.pronouns[serverID][user] = pronounsMap.get(pronouns);
    setOption(serverID, user, "pronouns", (pronouns.split("/")[0]))

	markForSave("pronouns");
};

exports.setPronouns = setPronouns;