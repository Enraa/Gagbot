const { getOption } = require("../functions/configfunctions");
const { getPronouns } = require("../functions/pronounfunctions");
const nlp = require("compromise");

const selfreplacements = [
    { regex: "i am", replace: `this SUBJECT is`}, // "I am"
    { regex: "i have", replace: `this SUBJECT has` }, // "I am"
    { regex: "i'd", replace: `this SUBJECT'd` }, // "I'd"
    { regex: "i'?ve", replace: `this SUBJECT has` }, // "I've"
    { regex: "i'?ll", replace: `this SUBJECT'll` }, // "I've"
    { regex: "i'?m", replace: `this SUBJECT is` }, // "I'm"
    { regex: "i", replace: `this SUBJECT` }, // "I"
    { regex: "me", replace: `this SUBJECT`}, // "me"
    { regex: "myself", replace: `this SUBJECT's self`}, // "myself"
    { regex: "my", replace: `this SUBJECT's`}, // "my"
    { regex: "gimmie", replace: `give this SUBJECT`}, // "me"
];

const garbleText = (text, parent, intensity, msg) => {
    let outtext = text;

    let replacementstring = "toy";
    if (getPronouns(msg.author.id, "subject") == "he") { replacementstring = "boy" }
    if (getPronouns(msg.author.id, "subject") == "she") { replacementstring = "girl" }
    if (getOption(msg.author.id, "deferentialgagsubject").length > 0) { replacementstring = getOption(msg.author.id, "deferentialgagsubject") }

    selfreplacements.forEach((r) => {
        if (r.regex === "i") {
            // Find any "I" that starts at the beginning of a sentence. Mark it accordingly with ╪
            let regexpattern = new RegExp(`(?:^|(?:[.!?]\\s))\\b(I)\\b`, "ig");
            // Compromise library can be used here to solve this!
            // I'm learning more about the shenanigans of this library than I ever expected. 
            let doc = nlp(outtext);
            let matches = doc.match(`[<subject>i] #Adverb? [<verb>#Verb]`)
            let start = false;
            // try-catch detecting the start because this is pretty deep lol
            try {
                start = (matches.groups('subject').json({ offset: true })[0].offset.start == 0);
            }
            catch (err) { }
            matches.groups('subject').replaceWith(`${start ? "T" : "t"}his ${replacementstring}`);
            matches.forEach((m) => {
                let conjugations = m.verbs().conjugate();
                if (m.verbs().json()[0].verb.root == conjugations[0].Infinitive) {
                    console.log(m.verbs().toPresentTense())
                }
                else {
                    console.log(m.verbs().json());
                    console.log(m.verbs().conjugate())
                    console.log(`Skipping changing because it is not infinitive.`)
                }
            })

            outtext = doc.text()
        }
        else {
            // I did not know replaceAll could take a function. 
            // First up, lets match all patterns at the beginning of a sentence.
            let regexpattern = new RegExp(`(?:^|(?:[.!?]\s))\\b(${r.regex})\\b`, "ig");
            outtext = outtext.replaceAll(regexpattern, (match) => {
                let rep = r.replace.replace('SUBJECT', replacementstring);
                //if (match[0] == match[0].toUpperCase()) {
                    rep = `${rep.charAt(0).toUpperCase()}${rep.slice(1)}`
                //}
                return rep;
            });
            // Now each form that isn't first. This won't be capitalized ever. 
            regexpattern = new RegExp(`\\b(${r.regex})\\b`, "ig");
            outtext = outtext.replaceAll(regexpattern, (match) => {
                let rep = r.replace.replace('SUBJECT', replacementstring);
                /*if (match[0] == match[0].toUpperCase()) {
                    rep = `${rep.charAt(0).toUpperCase()}${rep.slice(1)}`
                }*/
                return rep;
            });
        }
    })

    return outtext;
};

exports.garbleText = garbleText;
exports.choicename = "Deferential Gag";
