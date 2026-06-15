const { getOption } = require("../functions/getters/config/getOption");


const garbleText = (text, parent, intensity, msg) => {
	let newtextparts = text.split(" ");
	let outtext = text;
    let forbiddenwords = getOption(msg.author.id, "forbiddengagpunishwords") ?? [];
    console.log(forbiddenwords)
    if (!Array.isArray(forbiddenwords)) { return outtext } // Just skip this gag if it's not an array.
    forbiddenwords.forEach((w) => {
        let regexcomp = new RegExp(`\\b(${w})\\b`, "gi");
        let replacement = ``;
        let loopcount = 0;
        let loopmax = 100;
        for (let a = 0; a < w.length; a++) {
            replacement = `${replacement}✦`
        }
        if (outtext.match(regexcomp)) {
            while ((outtext.match(regexcomp)) && (loopcount < loopmax)) {
                outtext = outtext.replace(regexcomp, replacement)
                loopcount++;
            }
        }
    })
	return outtext;
}

exports.garbleText = garbleText;
exports.breathRecovery = (_user, intensity) => 1 - intensity / 20;

exports.choicename = "Forbidden Gag";