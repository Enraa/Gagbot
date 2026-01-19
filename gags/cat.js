const {processWords} = require("./../functions/gag_utilities.js");
// import { processWords } from "./gag_utilities.js";

const garbleText = (text, intensity) => {

    //replace m+vocal for meow and n+vocal for ny if word is 3+ letters long, and add nya if end word
    //+replace p+vocal+r for purrrr and grrrrr
    //+add random nya at end of sentences with 75% chance
    //+add random :3  ◕⩊◕  •⩊•  >⩊<  ^>w<^   at end of sentences with 25% chance

    text = processWords(text, (word) => {
        if (word.length > 2) {
            const matches = word.matchAll(/m[aeiouAEIOU]|M[aeiouAEIOU]/g);
            for (const match of matches) {
                word = word.replace(match[0], "meow" + match[0].slice(2));
            }
            const matches2 = word.matchAll(/n[aeiouAEIOU]|N[aeiouAEIOU]/g);
            for (const match of matches2) {
                word = word.replace(match[0], "ny" + match[0].slice(1));
                if (word.endsWith("ny")) {
                    word = word.slice(0, -2) + "nya";
                }
            }
            const matches3 = word.matchAll(/p[aeiouAEIOU]|P[aeiouAEIOU]r/g);
            for (const match of matches3) {
                word = word.replace(match[0], "pu" + "r".repeat(Math.floor(Math.random() * 7)));
            }
            const matches4 = word.matchAll(/gr|Gr|GR+/g);
            for (const match of matches4) {
                word = word.replace(match[0], "g" + "r".repeat(Math.floor(Math.random() * 6)));
            }
            return word;
        } else {
            return word;
        }
    });

    let matchesEnd = text.matchAll(/[.,;?!]\s+/g);
    matchesEnd = Array.from(matchesEnd);
    matchesEnd = matchesEnd.concat(text.matchAll(/[\n\r]+/g) || []);
    for (const match of matchesEnd) {
        if (Math.random() > (0.05 * intensity)) {
            text = text.replace(match[0], match[0] + [" :3 ", "  ◕⩊◕ ", "  •⩊• ", "  >⩊< ", "  ^>w<^ "][Math.floor(Math.random() * 5)]);
        }
        if (Math.random() > (0.50 - (0.05 * intensity))) {
            text = text.replace(match[0], match[0] + [" nya ", " nya ", " nya~ "][Math.floor(Math.random() * 3)]);
        }
    }

    return text;
}

exports.garbleText = garbleText;
exports.choicename = "Cat Gag";

// export const choicename = "Cat Gag";