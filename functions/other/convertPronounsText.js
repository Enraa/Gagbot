const { getPronouns } = require("../getters/config/getPronouns.js");
const { getOption } = require("../getters/config/getOption");
const { getHeadwear } = require("../getters/headwear/getHeadwear");
const { DOLLVISORS } = require("../headwearfunctions");

/***********
 * Converts a text string with USER and TARGET pronoun placeholders into appropriate output. Will also replace VAR_C1, VAR_C2, etc with .c1 and .c2 props from data param
 * 
 * - (string) text - The text to convert. 
 * - (object) data - Data object defined with the following props:
 * - --> interactionuser: The user whose pronouns will be used for USER_ placeholders
 * - --> targetuser: The user whose pronouns will be used for TARGET_ placeholders. 
 * - --> c1, c2, c3, etc?: Variables that can be used in the text as VAR_C1, VAR_C2, etc. Will be replaced with the value of data.c1, data.c2, etc.
 * ---
 * Valid placeholders for USER_ and TARGET_ are:
 * - TAG: Replaces with the user's tag
 * - THEY: They/She/He/It based on the user's subject pronoun
 * - THEYRE: They're/She's/He's/It's based on the user's subject pronoun
 * - ISARE: is/are based on whether subject pronoun is singular or plural
 * - WERE: was/were based on whether subject pronoun is singular or plural
 * - WERENT: wasn't/weren't based on whether subject pronoun is singular or plural
 * - DOESNT: doesn't/don't based on whether subject pronoun is singular or plural
 * - ES: es/blank based on whether subject pronoun is singular or plural
 * - S: s/blank based on whether subject pronoun is singular or plural
 * - TRY: try/tries based on whether subject pronoun is singular or plural
 * - HAVE: have/has based on whether subject pronoun is singular or plural
 * - PRAISEOBJECT: "girl", "boy", "toy" or what the user has configured in getOption(userID, "praiseobject")
 * ---
 * ##### Returns a string with appropriate pronouns
 ***********/
const convertPronounsText = (text, data) => {
	let interactionuser = data.interactionuser;
	let targetuser = data.targetuser ?? data.interactionuser; // If we didnt supply a target, just use interaction user for both. 

	let outtext = text;
    if (typeof outtext !== "string") {
        console.log("Error converting text. Text supplied to convertPronounsText was:")
        console.log(text)
        outtext = ``;
    }

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
        let praiseobject = "toy";
		if (user.subject == "she") {
			praiseobject = "girl";
		}
		if (user.subject == "he") {
			praiseobject = "boy";
		}
        if (isDoll) {
            praiseobject = "doll";
        }
		if (getOption(data.interactionuser.id, "praiseobject") != "follow") {
            praiseobject = getOption(data.interactionuser.id, "praiseobject");
        }
        return praiseobject;
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
        let praiseobject = "toy";
		if (target.subject == "she") {
			praiseobject = "girl";
		}
		if (target.subject == "he") {
			praiseobject = "boy";
		}
        if (targetDoll) {
            praiseobject = "doll";
        }
		if (getOption(data.targetuser.id, "praiseobject") != "follow") {
            praiseobject = getOption(data.targetuser.id, "praiseobject");
        }
        return praiseobject;
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

exports.convertPronounsText = convertPronounsText;
exports.they = (user, capitalise = false) => getPronouns(user, "subject", capitalise);
exports.them = (user, capitalise = false) => getPronouns(user, "object", capitalise);
exports.theirs = (user, capitalise = false) => getPronouns(user, "possessive", capitalise);
exports.their = (user, capitalise = false) => getPronouns(user, "possessiveDeterminer", capitalise);
exports.themself = (user, capitalise = false) => getPronouns(user, "reflexive", capitalise);
exports.theyre = (user, capitalise = false) => getPronouns(user, "subjectIs", capitalise);
exports.theyll = (user, capitalise = false) => getPronouns(user, "subjectWill", capitalise);