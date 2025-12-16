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


exports.setPronouns = setPronouns
exports.getPronouns = getPronouns
exports.getPronounsSet = getPronounsSet
exports.pronounsMap = pronounsMap