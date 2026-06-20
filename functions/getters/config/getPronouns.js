const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { pronounsMap } = require("../../../lists/pronounsMap");
const { remindPronouns } = require("../../pronounfunctions");
const { getProcessVariable } = require("./getProcessVariable");


/********************************************
 * Get a userID's pronoun of the necessary form.
 * 
 * - (server id) serverID - The server this is on
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
const getPronouns = (serverID, user, form, capitalize = false) => {
    traceFirstParam(arguments[0]);
    let output = "";
    if (getProcessVariable(serverID, user, "pronouns")) {
        output = getProcessVariable(serverID, user, "pronouns")[form];
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