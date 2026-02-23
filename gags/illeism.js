// Makes the wearer's words turn into simply writing their name. 
const nlp = require("compromise");
const nlpSpeech = require("compromise-speech");
nlp.extend(nlpSpeech);

const garbleText = async (text, parent, intensity, msg) => {
    // Determine how many syllables to include in output. 
    let syllablecount = 0;
    let textsplit = text.split(" ");
    for (let i = 0; i < textsplit.length; i++) {
        const parsed = nlp(textsplit[i])
            .compute("syllables")
            .terms()
            .json()[0];
        if (parsed && parsed.terms[0]) {
            syllablecount = syllablecount + parsed.terms[0].syllables.length
        }
    }

    // Determine how many syllables are in the user's display name. 
    let displaynameparsed = nlp(msg.member.displayName).compute("syllables").terms().json()[0]

    // We need the following kinds of phrases
    // 1. Full name, normal cost
    // 2. Last Syllable - should be used for singular sylable words preferably
    // 3. Sustained Last Syllable - can be used for 2-3 syllable words
    // 4. First Syllable - Can be used to end a sentence 

	return textout;
};

exports.garbleText = garbleText;
exports.choicename = "Illeism Gag";
exports.hidden = true;