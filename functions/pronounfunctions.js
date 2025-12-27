const fs = require('fs');
const path = require('path');
const https = require('https');


// Pronoun types
const pronounsMap = new Map([
    ["she/her",{
        "subject"               : "she",
        "object"                : "her",
        "possessive"            : "hers",
        "possessiveDeterminer"  : "her",
        "reflexive"             : "herself",
        "subjectIs"             : "she's",
        "subjectWill"           : "she'll",
    }],
    ["he/him",{
        "subject"                 : "he",
        "object"                  : "him",
        "possessive"              : "his",
        "possessiveDeterminer"    : "his",
        "reflexive"               : "himself",
        "subjectIs"             : "he's",
        "subjectWill"           : "he'll",
    }],
    ["they/them",{
        "subject"                 : "they",
        "object"                  : "them",
        "possessive"              : "theirs",
        "possessiveDeterminer"    : "their",
        "reflexive"               : "themself",
        "subjectIs"             : "they're",
        "subjectWill"           : "they'll",
    }],
    ["it/its",{
        "subject"                 : "it",
        "object"                  : "it",
        "possessive"              : "its",
        "possessiveDeterminer"    : "its",
        "reflexive"               : "itself",
        "subjectIs"             : "it's",
        "subjectWill"           : "it'll",
    }]
])


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
const getPronouns = (user, form, capitalize=false) => {
    if (process.pronouns == undefined) { process.pronouns = {} }
    let output = "";
    if(process.pronouns[user]){
        output = process.pronouns[user][form]
    }else{
        output = pronounsMap.get("they/them")[form]
    }
    if(capitalize){
        output = output.charAt(0).toUpperCase() + output.slice(1)
    }
    return output
}

/********************************************
 * getPronounsSet()
 * Get a user's pronouns in typical slash format
 * Ex: "she/her"
 * NOTE: "it/it" is grammatically correct, but repetitive. Opted for "it/its" as a stylistic choice.
 *******************************************/
const getPronounsSet =  (user) => {
    if (process.pronouns == undefined) { process.pronouns = {} }
    if(process.pronouns[user]){return `${process.pronouns[user]["subject"]}/${process.pronouns[user]["subject"] != "it" ? process.pronouns[user]["object"] : process.pronouns[user]["possessive"]}`}
    return `no pronouns set`
}

const setPronouns = (user, pronouns) => {
    if (process.pronouns == undefined) { process.pronouns = {} }

    process.pronouns[user] = pronounsMap.get(pronouns);

    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/pronounsusers.txt`, JSON.stringify(process.pronouns));
}

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
    let targetuser = data.targetuser;

    let outtext = text;

    // Replace interaction user first
    // TAG
    outtext = outtext.replaceAll("USER_TAG", `<@${interactionuser.id}>`);
    
    // Additionally, to handle a followup is/are:
    outtext = outtext.replaceAll("USER_ISARE", (getPronouns(interactionuser.id, "subject") == "they") ? "are" : "is");
    // And wasn't/weren't
    outtext = outtext.replaceAll("USER_WERENT", (getPronouns(interactionuser.id, "subject") == "they") ? "weren't" : "wasn't");
    // And "es"
    outtext = outtext.replaceAll("USER_ES", (getPronouns(interactionuser.id, "subject") == "they") ? "" : "es");
    // And "s"
    outtext = outtext.replaceAll("USER_S", (getPronouns(interactionuser.id, "subject") == "they") ? "" : "s");
    // And "try"
    outtext = outtext.replaceAll("USER_TRY", (getPronouns(interactionuser.id, "subject") == "they") ? "try" : "tries");

    // Reflexive - Himself, Herself, Themselves, etc.
    outtext = outtext.replaceAll("USER_THEMSELF_CAP", getPronouns(interactionuser.id, "reflexive", true));
    outtext = outtext.replaceAll("USER_THEMSELF", getPronouns(interactionuser.id, "reflexive"));

    // Object - Him, Her, Them, etc.
    outtext = outtext.replaceAll("USER_THEM_CAP", getPronouns(interactionuser.id, "object", true));
    outtext = outtext.replaceAll("USER_THEM", getPronouns(interactionuser.id, "object"));
    
    // Possessive - His, Hers, Theirs, etc.
    outtext = outtext.replaceAll("USER_THEIRS_CAP", getPronouns(interactionuser.id, "possessive", true));
    outtext = outtext.replaceAll("USER_THEIRS", getPronouns(interactionuser.id, "possessive"));
    
    // Possessive Determiner - His, Her, Their, etc.
    outtext = outtext.replaceAll("USER_THEIR_CAP", getPronouns(interactionuser.id, "possessiveDeterminer", true));
    outtext = outtext.replaceAll("USER_THEIR", getPronouns(interactionuser.id, "possessiveDeterminer"));
    
    // SubjectIs - He's, She's, They're
    outtext = outtext.replaceAll("USER_THEYRE_CAP", getPronouns(interactionuser.id, "subjectIs", true));
    outtext = outtext.replaceAll("USER_THEYRE", getPronouns(interactionuser.id, "subjectIs"));
    
    // SubjectWill - He'll, She'll, They'll
    outtext = outtext.replaceAll("USER_THEYLL_CAP", getPronouns(interactionuser.id, "subjectWill", true));
    outtext = outtext.replaceAll("USER_THEYLL", getPronouns(interactionuser.id, "subjectWill"));

    // Subject - He, She, They, etc.
    outtext = outtext.replaceAll("USER_THEY_CAP", getPronouns(interactionuser.id, "subject", true));
    outtext = outtext.replaceAll("USER_THEY", getPronouns(interactionuser.id, "subject"));
    

    // Now replace the target user
    // TAG
    outtext = outtext.replaceAll("TARGET_TAG", `<@${targetuser.id}>`);
    
    // Additionally, to handle a followup is/are:
    outtext = outtext.replaceAll("TARGET_ISARE", (getPronouns(targetuser.id, "subject") == "they") ? "are" : "is");
    // And wasn't/weren't
    outtext = outtext.replaceAll("TARGET_WERENT", (getPronouns(targetuser.id, "subject") == "they") ? "weren't" : "wasn't");
    // And "es"
    outtext = outtext.replaceAll("TARGET_ES", (getPronouns(targetuser.id, "subject") == "they") ? "" : "es");
    // And "s"
    outtext = outtext.replaceAll("TARGET_S", (getPronouns(targetuser.id, "subject") == "they") ? "" : "s");
    // And "try"
    outtext = outtext.replaceAll("TARGET_TRY", (getPronouns(targetuser.id, "subject") == "they") ? "try" : "tries");

    // Reflexive - Himself, Herself, Themselves, etc.
    outtext = outtext.replaceAll("TARGET_THEMSELF_CAP", getPronouns(targetuser.id, "reflexive", true));
    outtext = outtext.replaceAll("TARGET_THEMSELF", getPronouns(targetuser.id, "reflexive"));

    // Object - Him, Her, Them, etc.
    outtext = outtext.replaceAll("TARGET_THEM_CAP", getPronouns(targetuser.id, "object", true));
    outtext = outtext.replaceAll("TARGET_THEM", getPronouns(targetuser.id, "object"));
    
    // Possessive - His, Hers, Theirs, etc.
    outtext = outtext.replaceAll("TARGET_THEIRS_CAP", getPronouns(targetuser.id, "possessive", true));
    outtext = outtext.replaceAll("TARGET_THEIRS", getPronouns(targetuser.id, "possessive"));
    
    // Possessive Determiner - His, Her, Their, etc.
    outtext = outtext.replaceAll("TARGET_THEIR_CAP", getPronouns(targetuser.id, "possessiveDeterminer", true));
    outtext = outtext.replaceAll("TARGET_THEIR", getPronouns(targetuser.id, "possessiveDeterminer"));
    
    // SubjectIs - He's, She's, They're
    outtext = outtext.replaceAll("TARGET_THEYRE_CAP", getPronouns(targetuser.id, "subjectIs", true));
    outtext = outtext.replaceAll("TARGET_THEYRE", getPronouns(targetuser.id, "subjectIs"));
    
    // SubjectWill - He'll, She'll, They'll
    outtext = outtext.replaceAll("TARGET_THEYLL_CAP", getPronouns(targetuser.id, "subjectWill", true));
    outtext = outtext.replaceAll("TARGET_THEYLL", getPronouns(targetuser.id, "subjectWill"));

    // Subject - He, She, They, etc.
    outtext = outtext.replaceAll("TARGET_THEY_CAP", getPronouns(targetuser.id, "subject", true));
    outtext = outtext.replaceAll("TARGET_THEY", getPronouns(targetuser.id, "subject"));
    

    for(let i = 0; i < Object.keys(data).length; i++) {
        if (data[`c${i}`]) {
            outtext = outtext.replaceAll(`VAR_C${i}`, data[`c${i}`]);
        }
    }

    return outtext;
}


exports.they = (user, capitalise = false) => getPronouns(user, "subject", capitalise);
exports.them = (user, capitalise = false) => getPronouns(user, "object", capitalise);
exports.theirs = (user, capitalise = false) => getPronouns(user, "possessive", capitalise);
exports.their = (user, capitalise = false) => getPronouns(user, "possessiveDeterminer", capitalise);
exports.themself = (user, capitalise = false) => getPronouns(user, "reflexive", capitalise);
exports.theyre = (user, capitalise = false) => getPronouns(user, "subjectIs", capitalise);
exports.theyll = (user, capitalise = false) => getPronouns(user, "subjectWill", capitalise);

exports.setPronouns = setPronouns
exports.getPronouns = getPronouns
exports.getPronounsSet = getPronounsSet
exports.pronounsMap = pronounsMap
exports.convertPronounsText = convertPronounsText;