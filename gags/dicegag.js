/***************************
 * Dice gag - d20 gag for Gagbot
 * ~ Kali 
 * Standing on the shoulders of giants...
 * Derived from: 
 * Ball Gag by DollLia
 * Silent gag by Punyo
 * Polite sub gag by Enraa
 ***************************/

// Character maps stored in an array in a separate file for code cleanliness
const { ballGagCharMaps } = require("./ball/ballCharMap.js");

const isAllCaps = (text) => {
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
const garbleTextGag = (text, parent, intensity, roll, modifier) => {
	let output = "";
	let words = text.split(/\s/);
	
	if (modifier > 0) {
		output += "```" + "Rolled a " + roll + " with a modifier of -" + modifier + " trying to speak." + "```";
	}
	else if (modifier < 0) {
		output += "```" + "Rolled a " + roll + " with a modifier of +" + Math.abs(modifier) + " trying to speak." + "```";
	}
	else {
		output += "```" + "Rolled a " + roll + " trying to speak." + "```";
	}
	

	for (let x = 0; x < words.length; x++) {
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

// Helper function to garble a text segment for silent part.
const garbleTextSilent = (text, parent, intensity, roll) => {
	let output = "";
	let leakedSound = 0;
	output += "```" + "Rolled a nat " + roll + " trying to speak. Unlucky..." + "```";
	for (const char of text) {
		if (char == " " && leakedSound == 0 && Math.random() > 0.2 + 0.065 * intensity) {
			leakedSound = 1;
			output += " ";
			continue;
		}
		if (leakedSound == 1 && char != " ") {
			output += char;
			leakedSound++;
		} else if (leakedSound > 1 && char != " ") {
			output += "m";
		} else if (leakedSound > 1 && char == " ") {
			leakedSound = 0;
			output += "! ";
		} else if (char == " ") {
			output += " ";
		} else {
			output += ".";
		}
	}
	if (leakedSound > 1) {
		output += "! ";
	}

	// Dollminatrix Additions - Make it subscript.
	if(intensity >= 1){
		parent.parent.subscript = -1
	}

	return output;
};

const addNat20Msg = (text, parent) => {
	let output = "";
	output += "```" + "Rolled a nat 20 trying to speak. Critical success" + "```";
	output += text;
	return output;
}

const messagebegin = (msg, msgTree, msgTreeMods, intensity) => {
	// d20 code
	// Math.floor(Math.random() * x) goes from 0 to x-1 so we add 1 for an authentic d20 experience
	let roll = Math.floor(Math.random() * 20) + 1;
	//console.log(roll); // informative logging for dev purposes
	
	// nat 20 roll leave the message ungarbled, but add nat 20 text
	if (roll == 20) {
		msgTree.callFunc(addNat20Msg,true,["rawText","moan"]);
		msgTreeMods.modified = true;
		return;
	}

	// Nat 1 roll - make the message garbled by silent gag
	if (roll == 1) {
		msgTree.callFunc(garbleTextSilent,true,["rawText","moan"],[10, roll]);
		msgTreeMods.modified = true;
		return;
	}

	// passed nat 1 and nat 20 checks so roll is gonna be 
	// anything between 2 and 19 rolls use modifiers for 
	// gag strength
	let modifier = intensity - 5;
	let modifiedRoll = roll - modifier;

	//console.log("Modified roll: " + modifiedRoll); // informative logging for dev purposes
	
	// maps the roll ranges 1 to 19 to valid intensity range 1 to 10
	let mappedRoll = Math.round(((modifiedRoll - 1) / 19) * 9 + 1);
	// clamps mapped roll values to valid intensity values and inverts them due to bigger rolls actually
	// being better for speech while intensity works the opposite way
	let newIntensity = 11 - Math.min(Math.max(mappedRoll, 1), 10);

	//console.log("mapped roll: " + mappedRoll + " newintensity: " + newIntensity); // informative logging for dev purposes
	msgTree.callFunc(garbleTextGag,true,["rawText","moan"],[newIntensity, roll, modifier]);
	msgTreeMods.modified = true;
	return;
};

exports.messagebegin = messagebegin;
exports.choicename = "Dice Gag";