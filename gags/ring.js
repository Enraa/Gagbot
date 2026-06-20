/***************************
 * Ring gag - Ring gag update
 * ~ Kali 
 * Standing on the shoulders of giants...
 * Inspired by: 
 * Ball Gag setup by DollLia
 ***************************/

// Character map stored in a separate file for code cleanliness/reusability
const { ringGagCharMap } = require("./ring/ringCharMap.js");

const isAllCaps = (text) => {
	return text == text.toUpperCase() && /[A-Z]/g.test(text);
};

const totalAlphas = (text) => {
	let count = 0;
	for (let itr = 0; itr < text.length; itr++) {
		if (text[itr].match(/[A-Za-z]/)) {
			count++;
		}
	}
	return count;
};

const garbleText = (text, parent, intensity) => {
	let output = "";
	//splits by regex of any whitespace char so we have word arra
	let words = text.split(/\s/);

	// custom Ring gag addition - check for word amount and if past certain threshold add a chance to interrupt
	let doGagInterrupt = false;
	let gagInterruptUsed = false;
	if (words.length > 8) {
		doGagInterrupt = true;
	}

	for (let x = 0; x < words.length; x++) {
		/* Gag interrupt message */
		// TODO: implement gag interrupt with user pronoun respective messages
		
		/* gag garble code - quick adaptation from DollLia's ball gag one */
		let allCaps = isAllCaps(words[x]);
		// Special case for "I", "a", etc.
		if (allCaps && totalAlphas(words[x]) == 1) {
			if ((words[x - 1] && isAllCaps(words[x - 1])) || (words[x + 1] && isAllCaps(words[x + 1]))) {
			} else {
				allCaps = false;
			}
		}

		let itr = 0;
		let prevChar = null;
		for (const char of words[x]) {
			// Test for uppercase.
			let isUppercase = allCaps || char != char.toLowerCase();

			// Get the new character.
			let newChar = ringGagCharMap.get(char.toLowerCase());

			if (newChar) {
				// If char is mapped, swap it

				let nextChar;
				if (newChar.length == 2 && char.toLowerCase() == (prevChar ? prevChar.toLowerCase() : null)) {
					//console.log("Prev: " + prevChar + "; Next: " + char)
					nextChar = isUppercase ? newChar[1].toUpperCase() : newChar[1];
				} else {
					nextChar = isUppercase ? newChar[0].toUpperCase() + (newChar[1] ? newChar[1] : "") : newChar;
				}

				if (allCaps) {
					nextChar = nextChar.toUpperCase();
				}
				output += nextChar;
			} else {
				// Append an unmodified character.
				output += char;
			}
			prevChar = char; // Store previous char
			itr++; // THEN iterate
		}

		if (x < words.length - 1) {
			output += " ";
		}
	}

	return output;
};

exports.garbleText = garbleText;
exports.choicename = "Ring Gag";
