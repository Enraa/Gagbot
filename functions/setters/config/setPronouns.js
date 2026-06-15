const { markForSave } = require("../../other/markForSave");
const { setOption } = require("./setOption");

/*********
 * Sets pronouns for a user
 * 
 * - (user id) user - The person setting pronouns
 * - (string) pronouns - "she/her", "he/him", "they/them", "it/its"
 * ---
 * ##### *No return value*
 *********/
function setPronouns(user, pronouns) {
	if (process.pronouns == undefined) {
		process.pronouns = {};
	}

	process.pronouns[user] = pronounsMap.get(pronouns);
    setOption(user, "pronouns", (pronouns.split("/")[0]))

	markForSave("pronouns");
};

exports.setPronouns = setPronouns;