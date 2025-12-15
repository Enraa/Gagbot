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

const setPronouns = (user, pronouns) => {
    if (process.pronouns == undefined) { process.pronouns = {} }

    process.pronouns[user] = pronounsMap.get(pronouns);

    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/pronounsusers.txt`, JSON.stringify(process.pronouns));
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
exports.pronounsMap = pronounsMap