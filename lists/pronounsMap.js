// Pronoun types
const pronounsMap = new Map([
	["she/her", { subject: "she", object: "her", possessive: "hers", possessiveDeterminer: "her", reflexive: "herself", subjectIs: "she's", subjectWill: "she'll" }],
	["he/him", { subject: "he", object: "him", possessive: "his", possessiveDeterminer: "his", reflexive: "himself", subjectIs: "he's", subjectWill: "he'll" }],
	["they/them", { subject: "they", object: "them", possessive: "theirs", possessiveDeterminer: "their", reflexive: "themself", subjectIs: "they're", subjectWill: "they'll" }],
	["it/its", { subject: "it", object: "it", possessive: "its", possessiveDeterminer: "its", reflexive: "itself", subjectIs: "it's", subjectWill: "it'll" }],
]);

exports.pronounsMap = pronounsMap;