/***************************
 * Gummy Gag for Gagbot
 * ~ Pyra - Derived from Ball Gag by DollLia
 ***************************/

// Character maps stored in an array in a separate file for code cleanliness
const { ballGagCharMaps } = require("./ball/ballCharMap.js");

const isAllCaps = (text) => {
	//(words[x].match(/[A-Z]/) && !words[x].match(/[a-z]/)) ? true : false;
	return text == text.toLowerCase().toUpperCase() && /[A-Z]/g.test(text);
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

// Helper function to garble a text segment.
const garbleText = (text, parent, intensity) => {
	//console.log("Text Seg: " + text)

	let output = "";
	let words = text.split(/\s/);

	for (let x = 0; x < words.length; x++) {
		let allCaps = isAllCaps(words[x]);
		// Special case for "I", "a", etc.
		if (allCaps && totalAlphas(words[x]) == 1) {
			//words[x].length == 1){
			//console.log(`Run Test: ${words[x-1]} - ${words[x]} - ${words[x+1]}`)
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

			// Get the new character using the array of character maps.
			// 10 intensities, only five maps.
			let newChar = ballGagCharMaps[Math.ceil(intensity / 2) - 1].get(char.toLowerCase());

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
exports.breathRecovery = (_user, intensity) => 1 - intensity / 20;
exports.choicename = "Gummy Gag";

// Clear Dissolve Timer
exports.onUnlock = (data) => {
	setUserVar(userID, "confectionaryDissolveTimer", undefined)
}

// Unit Tests

//Test Gag Intensities
// let intensityTestMsg = "I AM LOUD.  I am quiet."
// let intensityTestMsg2 = "Ha! I, in my brattiness, created  test-4, a test. . .  just to anger DOLL-0014 into domming me!!"

// console.log(`Original:     ${intensityTestMsg}\n`)
// console.log(`Intensity 1-2:   ${garbleText(intensityTestMsg, 1)}`)
// console.log(`Intensity 3-4:   ${garbleText(intensityTestMsg, 3)}`)
// console.log(`Intensity 5-6:   ${garbleText(intensityTestMsg, 5)}`)
// console.log(`Intensity 7-8:   ${garbleText(intensityTestMsg, 7)}`)
// console.log(`Intensity 9-10:  ${garbleText(intensityTestMsg, 9)}`)

// console.log(`\nOriginal:     ${intensityTestMsg2}\n`)
// console.log(`Intensity 1-2:   ${garbleText(intensityTestMsg2, 2)}`)
// console.log(`Intensity 3-4:   ${garbleText(intensityTestMsg2, 4)}`)
// console.log(`Intensity 5-6:   ${garbleText(intensityTestMsg2, 6)}`)
// console.log(`Intensity 7-8:   ${garbleText(intensityTestMsg2, 8)}`)
// console.log(`Intensity 9-10:  ${garbleText(intensityTestMsg2, 10)}`)
