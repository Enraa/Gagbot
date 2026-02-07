const fs = require("fs");
const path = require("path");
const https = require("https");
const { getOption } = require("../functions/configfunctions.js");
const { DOLLVISORS, getHeadwear } = require("../functions/headwearfunctions.js");

// Pronoun types
const pronounsMap = new Map([
	["she/her", { subject: "she", object: "her", possessive: "hers", possessiveDeterminer: "her", reflexive: "herself", subjectIs: "she's", subjectWill: "she'll" }],
	["he/him", { subject: "he", object: "him", possessive: "his", possessiveDeterminer: "his", reflexive: "himself", subjectIs: "he's", subjectWill: "he'll" }],
	["they/them", { subject: "they", object: "them", possessive: "theirs", possessiveDeterminer: "their", reflexive: "themself", subjectIs: "they're", subjectWill: "they'll" }],
	["it/its", { subject: "it", object: "it", possessive: "its", possessiveDeterminer: "its", reflexive: "itself", subjectIs: "it's", subjectWill: "it'll" }],
]);

//console.log(...pronounsMap.keys())

/***************************************************************
 * process.pronouns File Structure
 *
 * JSON Object of JSON Objects with the following format:
 *
 *  process.pronouns = {
 *      125093095405518850 : {
 *          subject: "she",
 *          object: "her",
 *          possessive: "hers",
 *          possessiveDeterminer: "her",
 *          reflexive: "herself"
 *      }
 *  }
 ***************************************************************/

/********************************************
 * getPronoun()
 * Get a user's pronoun of the necessary form.
 *
 * If no form specified, give the object containing all.  Useful to reduce calls?
 *  > To create "she/her", you need subject/object
 *******************************************/
const getPronouns = (user, form, capitalize = false) => {
	if (process.pronouns == undefined) {
		process.pronouns = {};
	}
	let output = "";
	if (process.pronouns[user]) {
		output = process.pronouns[user][form];
	} else {
		output = pronounsMap.get("they/them")[form];
	}
	if (capitalize) {
		output = output.charAt(0).toUpperCase() + output.slice(1);
	}
	return output;
};

/********************************************
 * getPronounsSet()
 * Get a user's pronouns in typical slash format
 * Ex: "she/her"
 * NOTE: "it/it" is grammatically correct, but repetitive. Opted for "it/its" as a stylistic choice.
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

const setPronouns = (user, pronouns) => {
	if (process.pronouns == undefined) {
		process.pronouns = {};
	}

	process.pronouns[user] = pronounsMap.get(pronouns);

	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.pronouns = true;
};

// -----------------------------------------------------------------
// convertPronounsText()
// Takes a string and a data object, which should include user and target
// Will also assign variables to c0, c1, c2, c3, etc if something additional
// is required during the function. These will be reflected as
// VAR_C0, VAR_C1, VAR_C2, VAR_C3 in the text as necessary.
// Outputs text with pronouns as appropriate.
// -----------------------------------------------------------------
const convertPronounsText = (text, data) => {
	let interactionuser = data.interactionuser;
	let targetuser = data.targetuser ?? data.interactionuser; // If we didnt supply a target, just use interaction user for both. 

	let outtext = text;

	let user = { subject: getPronouns(interactionuser.id, "subject"), object: getPronouns(interactionuser.id, "object"), possessive: getPronouns(interactionuser.id, "possessive"), possessiveDeterminer: getPronouns(interactionuser.id, "possessiveDeterminer"), reflexive: getPronouns(interactionuser.id, "reflexive"), subjectIs: getPronouns(interactionuser.id, "subjectIs"), subjectWill: getPronouns(interactionuser.id, "subjectWill") };

	let isDoll = false;
	if ((getOption(interactionuser.id, "dollforcedit") == "enabled" && getHeadwear(interactionuser.id).find((headwear) => DOLLVISORS.includes(headwear))) || getHeadwear(interactionuser.id).find((headwear) => headwear === "dollmaker_visor")) {
		((user.subject = "it"), (user.object = "it"), (user.possessive = "its"), (user.possessiveDeterminer = "its"), (user.reflexive = "itself"), (user.subjectIs = "it's"), (user.subjectWill = "it'll"));
		isDoll = true;
	}

	let target = { subject: getPronouns(targetuser.id, "subject"), object: getPronouns(targetuser.id, "object"), possessive: getPronouns(targetuser.id, "possessive"), possessiveDeterminer: getPronouns(targetuser.id, "possessiveDeterminer"), reflexive: getPronouns(targetuser.id, "reflexive"), subjectIs: getPronouns(targetuser.id, "subjectIs"), subjectWill: getPronouns(targetuser.id, "subjectWill") };

	let targetDoll = false;
	if (getOption(targetuser.id, "dollforcedit") == "enabled" && getHeadwear(targetuser.id).find((headwear) => DOLLVISORS.includes(headwear))) {
		((target.subject = "it"), (target.object = "it"), (target.possessive = "its"), (target.possessiveDeterminer = "its"), (target.reflexive = "itself"), (target.subjectIs = "it's"), (target.subjectWill = "it'll"));
		targetDoll = true;
	}

	// Replace interaction user first
	// TAG
	outtext = outtext.replaceAll("USER_TAG", `<@${interactionuser.id}>`);

	// Additionally, to handle a followup is/are:
	outtext = outtext.replaceAll("USER_ISARE", user.subject == "they" ? "are" : "is");
	// And was/were
	outtext = outtext.replaceAll("USER_WERE", user.subject == "they" ? "were" : "was");
	// And wasn't/weren't
	outtext = outtext.replaceAll("USER_WERENT", user.subject == "they" ? "weren't" : "wasn't");
	// And "doesn't"
	outtext = outtext.replaceAll("USER_DOESNT", user.subject == "they" ? "don't" : "doesn't");
	// And "es"
	outtext = outtext.replaceAll("USER_ES", user.subject == "they" ? "" : "es");
	// And "s"
	outtext = outtext.replaceAll("USER_S", user.subject == "they" ? "" : "s");
	// And "try"
	outtext = outtext.replaceAll("USER_TRY", user.subject == "they" ? "try" : "tries");
	// And "have"
	outtext = outtext.replaceAll("USER_HAVE", target.subject == "they" ? "have" : "has");

	// Other Replacements
	outtext = outtext.replaceAll("USER_PRAISEOBJECT", () => {
		if (user.subject == "she") {
			return "girl";
		}
		if (user.subject == "he") {
			return "boy";
		}
		return isDoll ? "doll" : "toy";
	});

	// Reflexive - Himself, Herself, Themselves, etc.
	outtext = outtext.replaceAll("USER_THEMSELF_CAP", user.reflexive.slice(0, 1).toUpperCase() + user.reflexive.slice(1));
	outtext = outtext.replaceAll("USER_THEMSELF", user.reflexive);

	// Object - Him, Her, Them, etc.
	outtext = outtext.replaceAll("USER_THEM_CAP", user.object.slice(0, 1).toUpperCase() + user.object.slice(1));
	outtext = outtext.replaceAll("USER_THEM", user.object);

	// Possessive - His, Hers, Theirs, etc.
	outtext = outtext.replaceAll("USER_THEIRS_CAP", user.possessive.slice(0, 1).toUpperCase() + user.possessive.slice(1));
	outtext = outtext.replaceAll("USER_THEIRS", user.possessive);

	// Possessive Determiner - His, Her, Their, etc.
	outtext = outtext.replaceAll("USER_THEIR_CAP", user.possessiveDeterminer.slice(0, 1).toUpperCase() + user.possessiveDeterminer.slice(1));
	outtext = outtext.replaceAll("USER_THEIR", user.possessiveDeterminer);

	// SubjectIs - He's, She's, They're
	outtext = outtext.replaceAll("USER_THEYRE_CAP", user.subjectIs.slice(0, 1).toUpperCase() + user.subjectIs.slice(1));
	outtext = outtext.replaceAll("USER_THEYRE", user.subjectIs);

	// SubjectWill - He'll, She'll, They'll
	outtext = outtext.replaceAll("USER_THEYLL_CAP", user.subjectWill.slice(0, 1).toUpperCase() + user.subjectWill.slice(1));
	outtext = outtext.replaceAll("USER_THEYLL", user.subjectWill);

	// Subject - He, She, They, etc.
	outtext = outtext.replaceAll("USER_THEY_CAP", user.subject.slice(0, 1).toUpperCase() + user.subject.slice(1));
	outtext = outtext.replaceAll("USER_THEY", user.subject);

	// Now replace the target user
	// TAG
	outtext = outtext.replaceAll("TARGET_TAG", `<@${targetuser.id}>`);

	// Additionally, to handle a followup is/are:
	outtext = outtext.replaceAll("TARGET_ISARE", target.subject == "they" ? "are" : "is");
	// And was/were
	outtext = outtext.replaceAll("TARGET_WERE", target.subject == "they" ? "were" : "was");
	// And wasn't/weren't
	outtext = outtext.replaceAll("TARGET_WERENT", target.subject == "they" ? "weren't" : "wasn't");
	// And "doesn't"
	outtext = outtext.replaceAll("TARGET_DOESNT", target.subject == "they" ? "don't" : "doesn't");
	// And "es"
	outtext = outtext.replaceAll("TARGET_ES", target.subject == "they" ? "" : "es");
	// And "s"
	outtext = outtext.replaceAll("TARGET_S", target.subject == "they" ? "" : "s");
	// And "try"
	outtext = outtext.replaceAll("TARGET_TRY", target.subject == "they" ? "try" : "tries");
	// And "have"
	outtext = outtext.replaceAll("TARGET_HAVE", target.subject == "they" ? "have" : "has");

	// Other Replacements
	outtext = outtext.replaceAll("TARGET_PRAISEOBJECT", () => {
		if (target.subject == "she") {
			return "girl";
		}
		if (target.subject == "he") {
			return "boy";
		}
		return targetDoll ? "doll" : "toy";
	});

	// Reflexive - Himself, Herself, Themselves, etc.
	outtext = outtext.replaceAll("TARGET_THEMSELF_CAP", target.reflexive.slice(0, 1).toUpperCase() + target.reflexive.slice(1));
	outtext = outtext.replaceAll("TARGET_THEMSELF", target.reflexive);

	// Object - Him, Her, Them, etc.
	outtext = outtext.replaceAll("TARGET_THEM_CAP", target.object.slice(0, 1).toUpperCase() + target.object.slice(1));
	outtext = outtext.replaceAll("TARGET_THEM", target.object);

	// Possessive - His, Hers, Theirs, etc.
	outtext = outtext.replaceAll("TARGET_THEIRS_CAP", target.possessive.slice(0, 1).toUpperCase() + target.possessive.slice(1));
	outtext = outtext.replaceAll("TARGET_THEIRS", target.possessive);

	// Possessive Determiner - His, Her, Their, etc.
	outtext = outtext.replaceAll("TARGET_THEIR_CAP", target.possessiveDeterminer.slice(0, 1).toUpperCase() + target.possessiveDeterminer.slice(1));
	outtext = outtext.replaceAll("TARGET_THEIR", target.possessiveDeterminer);

	// SubjectIs - He's, She's, They're
	outtext = outtext.replaceAll("TARGET_THEYRE_CAP", target.subjectIs.slice(0, 1).toUpperCase() + target.subjectIs.slice(1));
	outtext = outtext.replaceAll("TARGET_THEYRE", target.subjectIs);

	// SubjectWill - He'll, She'll, They'll
	outtext = outtext.replaceAll("TARGET_THEYLL_CAP", target.subjectWill.slice(0, 1).toUpperCase() + target.subjectWill.slice(1));
	outtext = outtext.replaceAll("TARGET_THEYLL", target.subjectWill);

	// Subject - He, She, They, etc.
	outtext = outtext.replaceAll("TARGET_THEY_CAP", target.subject.slice(0, 1).toUpperCase() + target.subject.slice(1));
	outtext = outtext.replaceAll("TARGET_THEY", target.subject);

	for (let i = 0; i < Object.keys(data).length; i++) {
		if (data[`c${i}`]) {
			outtext = outtext.replaceAll(`VAR_C${i}`, data[`c${i}`]);
		}
	}

	return outtext;
};

exports.they = (user, capitalise = false) => getPronouns(user, "subject", capitalise);
exports.them = (user, capitalise = false) => getPronouns(user, "object", capitalise);
exports.theirs = (user, capitalise = false) => getPronouns(user, "possessive", capitalise);
exports.their = (user, capitalise = false) => getPronouns(user, "possessiveDeterminer", capitalise);
exports.themself = (user, capitalise = false) => getPronouns(user, "reflexive", capitalise);
exports.theyre = (user, capitalise = false) => getPronouns(user, "subjectIs", capitalise);
exports.theyll = (user, capitalise = false) => getPronouns(user, "subjectWill", capitalise);

exports.setPronouns = setPronouns;
exports.getPronouns = getPronouns;
exports.getPronounsSet = getPronounsSet;
exports.pronounsMap = pronounsMap;
exports.convertPronounsText = convertPronounsText;
