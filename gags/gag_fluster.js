const { getUserVar } = require("../functions/getters/config/getUserVar");
const { convertPronounsText } = require("../functions/other/convertPronounsText");
const nlp = require("compromise");
const nlpSpeech = require("compromise-speech");
nlp.extend(nlpSpeech);

// all the alphabet and numbers, and then a true keysmash!
const charmap = 'abcdefghijklmnopqrstuvwxyzuijkhenrnjguijnduibgvnhdsieuxdfhsjei8uf7henufjihsnvciuyxdhjsrifgsirufhsiufhnsuijfniuehfisuhiufhsnijbvcihjomoiljoikmjdslkjn0123456789';

const flusterblushes = [">////<", ">//<", ">//////<", "(//﹏//)", "(⸝>﹏<⸝)", "(ᵕ˶๑﹏๑˶)", "(,,>﹏<,,)", "₍₍⚞(⸝⸝>⸝⸝<⸝⸝)⚟⁾⁾", "(⸝⸝๑﹏๑⸝⸝)", "(˶˃ ᵕ ˂˶)", "♡(๑﹏๑//)♡", "@.@", "@_@"]

const messagebegin = (msg, msgTree, msgTreeMods, intensity) => {
    if (getUserVar(msg.guild.id, msg.author.id, "fluster")) {
        let silenced = {"isSilenced": false, id: msg.author.id, guildid: msg.guild.id, intensity: intensity }
        msgTree.callFunc(garble,true,["rawText","moan"],[silenced])	// Run a function on the tree.
        msgTreeMods.modified = true;
    }
}

const garble = (text, parent, locarr, silent) => {
	const parsed = nlp(text)
		.compute("syllables")
		.terms()
		.json();
    
    let outtext = ``;

	for (let i in parsed) {
		let word = parsed[i].text;
		if (word.length > 0) {
			console.log(word)
		}
        let syllables = parsed[i].terms[0].syllables;
        console.log(syllables)
        syllables.forEach((syl) => {
            // Roll the flustering every single syllable
            if (!silent.isSilenced && ((Math.random()) < (silent.intensity / 20))) {
                silent.isSilenced = true;
                if (outtext.length > 0) {
                    outtext = outtext.slice(0,-2); // Take out the last space so the fluster runs together
                }
            }
            if (silent.isSilenced) {
                let char = ``;
                let charlength = Math.max(Math.floor(syl.length * (0.8 + (0.4 * Math.random()))), 1) // 80-140% of character length
                for (let c = 0; c < charlength; c++) {
                    char = `${char}${charmap[Math.floor(Math.random() * charmap.length)]}`
                }
                outtext = `${outtext}${char}`
            }
            else {
                outtext = `${outtext}${syl}`
            }
        })
        // Spaces should be flustered too if silenced. 
        if (silent.isSilenced) {
            outtext = `${outtext}${charmap[Math.floor(Math.random() * charmap.length)]}`
        }
        else {
            outtext = `${outtext} `;
        }
	}
    if (silent.isSilenced && ((Math.random()) < (silent.intensity / 5))) {
        outtext = `${outtext} ${flusterblushes[Math.floor(Math.random() * flusterblushes.length)]}`
    }

    console.log(text);
    console.log(outtext);

    return outtext;
};

exports.messagebegin = messagebegin;
exports.choicename = "Flustered Gag";
