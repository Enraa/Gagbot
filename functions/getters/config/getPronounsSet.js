/********************************************
 * Get a user's pronouns in typical slash format - Ex: "she/her"
 * ##### NOTE: "it/it" is grammatically correct, but repetitive. Opted for "it/its" as a stylistic choice.
 * 
 * - (user id) user - The user to retrieve pronouns for
 * ---
 * ##### Returns a string with the user's standard pronoun representation
 *******************************************/
const getPronounsSet = (user) => {
	if (process.pronouns == undefined) {
		process.pronouns = {};
	}
	if (process.pronouns[user]) {
		return `${process.pronouns[user]["subject"]}/${process.pronouns[user]["subject"] != "it" ? process.pronouns[user]["object"] : process.pronouns[user]["possessive"]}`;
	}
	return `no pronouns set`;
};

exports.getPronounsSet = getPronounsSet;