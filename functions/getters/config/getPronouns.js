const { remindPronouns, pronounsMap } = require("../../pronounfunctions");

/********************************************
 * Get a userID's pronoun of the necessary form.
 * 
 * - (user id) user - The user whose pronouns we want to get
 * - (string) form - The linguistic form to get. See below.
 * - (boolean) capitalize - If true, capitalizes the first letter
 * ---
 * - subject: "they",
 * - object: "them",
 * - possessive: "theirs",
 * - possessiveDeterminer: "their",
 * - reflexive: "themself"
 * ---
 * ##### Returns a string with the user's pronoun in the appropriate tense
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
        // If the user has not set pronouns, we should try to send them a DM to have them do so
        remindPronouns(user);
    }
    if (capitalize) {
        output = output.charAt(0).toUpperCase() + output.slice(1);
    }
    return output;
};

exports.getPronouns = getPronouns;