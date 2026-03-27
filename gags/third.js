const { getOption } = require("../functions/configfunctions");
const { getPronouns } = require("../functions/pronounfunctions");
const nlp = require("compromise");

const selfreplacements = [
    { regex: "i am", replace: `SUBJECT is`}, // "I am"
    { regex: "i have", replace: `SUBJECT has` }, // "I am"
    { regex: "i'd", replace: `SUBJECT'd` }, // "I'd"
    { regex: "i'?ve", replace: `SUBJECT has` }, // "I've"
    { regex: "i'?ll", replace: `SUBJECT'll` }, // "I've"
    { regex: "i'?m", replace: `SUBJECT is` }, // "I'm"
    { regex: "i", replace: `SUBJECT` }, // "I"
    { regex: "me", replace: `SUBJECT`}, // "me"
    { regex: "myself", replace: `SUBJECT's self`}, // "myself"
    { regex: "my", replace: `SUBJECT's`}, // "my"
    { regex: "gimmie", replace: `give SUBJECT`}, // "me"
];

// This is called after parsing the message tree, just after the emoji. 
const pregarble = (text, parent, intensity, msg) => {
    let outtext = text;

    let replacementstring = "this toy";
    if (getPronouns(msg.author.id, "subject") == "he") { replacementstring = "this boy" }
    if (getPronouns(msg.author.id, "subject") == "she") { replacementstring = "this girl" }
    if (getOption(msg.author.id, "deferentialgagsubject").length > 0) { replacementstring = getOption(msg.author.id, "deferentialgagsubject") }

    // Set up sentence array. 
    let docin = nlp(outtext);
    let docarray = [];
    docarray = docin.out('array');
    
    if (docarray.length > 0) {
        for (let di = 0; di < docarray.length; di++) {
            selfreplacements.forEach((r) => {
                if (r.regex === "i") {
                    // Find any "I" that starts at the beginning of a sentence. Mark it accordingly with ╪
                    let regexpattern = new RegExp(`(?:^|(?:[.!?]\\s))\\b(I)\\b`, "ig");
                    // Compromise library can be used here to solve this!
                    // I'm learning more about the shenanigans of this library than I ever expected. 
                    let doc = nlp(docarray[di]);
                    let matches = doc.match(`[<subject>i] #Adverb? [<verb>#Verb]`)
                    let tense = "present";
                    let modal = matches.groups('verb').has(`#Modal`) ? true : false;
                    if (matches.groups('verb').has(`#PastTense`)) { tense = "past" };
                    if (matches.groups('verb').has(`#FutureTense`)) { tense = "future" };
                    let start = false;
                    // try-catch detecting the start because this is pretty deep lol
                    try {
                        start = (matches.groups('subject').json({ offset: true })[0].offset.start == 0);
                    }
                    catch (err) { }
                    matches.groups(`subject`).forEach((sub, i) => {
                        sub.replaceWith(i == 0 ? `${start ? "T" : "t"}his ${replacementstring}` : `this ${replacementstring}`)
                    })
                    matches.forEach((m) => {
                        let conjugations = m.verbs().conjugate();
                        console.log(m.verbs().first().text())
                        if (!modal || !m.verbs().first().text().endsWith('s')) {
                            if (tense == "past") {
                                m.sentences().toPastTense();
                            }
                            else if (tense == "present") {
                                m.sentences().toPresentTense();
                            }
                            else if (tense == "future") {
                                m.sentences().toFutureTense();
                            }
                            else {
                                console.log("something broke");
                            }
                        }
                    })

                    docarray[di] = doc.text()
                }
                else {
                    // I did not know replaceAll could take a function. 
                    // First up, lets match all patterns at the beginning of a sentence.
                    let regexpattern = new RegExp(`(?:^|(?:[.!?]\s))\\b(${r.regex})\\b`, "ig");
                    docarray[di] = docarray[di].replaceAll(regexpattern, (match) => {
                        let rep = r.replace.replace('SUBJECT', replacementstring);
                        //if (match[0] == match[0].toUpperCase()) {
                            rep = `${rep.charAt(0).toUpperCase()}${rep.slice(1)}`
                        //}
                        return rep;
                    });
                    // Now each form that isn't first. This won't be capitalized ever. 
                    regexpattern = new RegExp(`\\b(${r.regex})\\b`, "ig");
                    docarray[di] = docarray[di].replaceAll(regexpattern, (match) => {
                        let rep = r.replace.replace('SUBJECT', replacementstring);
                        return rep;
                    });
                }
            })
        }
    }
    
    return docarray.join(" ");
};

exports.pregarble = pregarble;
exports.choicename = "Deferential Gag";
