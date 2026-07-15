/***************************
 * Ring gag - Ring gag update
 * ~ Kali 
 * Standing on the shoulders of giants...
 * Inspired by: 
 * Ball Gag setup by DollLia
 ***************************/

// Character map stored in a separate file for code cleanliness/reusability
const { ringGagCharMap } = require("./ring/ringCharMap.js");
// Ring gag interrupt messages list stored in separate file
const { ringGagInterruptList } = require("./ring/ringInterruptMessages.js");
// Pronouns conversion function import for gag interrupts
const { convertPronounsText } = require("../functions/other/convertPronounsText");

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

const garbleText = (text, parent, locarr, intensity, msg) => {
	let output = "";
	//splits by regex of any whitespace char so we have word arra
	let words = text.split(/\s/);

	/* custom Ring gag addition - vars to define interrupt behaviour */
	let wordsNeededForInterruptReset = 20;
	let minInterruptWords = 8;
	let wordGracePeriodAfterFirst = 5;
	
	let gagInterruptUsed = false;
	let doGagInterrupt = false;
	let interruptPosition = 0;

	let interruptIntensityRNGWeightPercent = 3;
	let interruptWordRNGWeightPercent = 1;
	let baselineChanceToInterrupt = intensity * interruptIntensityRNGWeightPercent;
	// initial check to enable gag interrupt for sentences with enough words in them
	if (words.length >= minInterruptWords) {
		doGagInterrupt = true;

		/* 
		Feel like I should explain this one - basically takes a portion of intensity or raw intensity value
		and uses that to randomly determine message interrupt location from the end of the message 
		with the intent being that higher intensity means higher chance to encounter the interrupt sooner in the message
		 */
		let wordsInFirstPart = words.length % wordsNeededForInterruptReset;
		if (words.length >= wordsNeededForInterruptReset){
			wordsInFirstPart = wordsNeededForInterruptReset;
		}
		interruptPosition = wordsInFirstPart - Math.min(Math.floor(Math.random() * intensity) + 1, wordsInFirstPart - 1);
	}

	//console.log("interruptMinPosition: " + interruptPosition); // informative logging for dev purposes
	for (let x = 0; x < words.length; x++) {
		/* Gag interrupt message handling */
		// does the reset every predetermined amount of words so interrupt messages can show up more than once in long sentences
		if (gagInterruptUsed && x % wordsNeededForInterruptReset == 0) {
			gagInterruptUsed = false;
			interruptPosition = x + wordGracePeriodAfterFirst;
		}

		// check if can do interrupt, interrupt has not been used within this word interval and current word is past initial position for interrupt
		//console.log("interruptPosition: " + interruptPosition + " gagInterruptUsed: " + gagInterruptUsed + " x: " + x); // informative logging for dev purposes
		if (doGagInterrupt && !gagInterruptUsed && x >= interruptPosition) {
			// do rng based on intensity to proc the message
			let chanceToInterrupt = baselineChanceToInterrupt + (x % wordsNeededForInterruptReset) * interruptWordRNGWeightPercent;
			let roll = Math.floor(Math.random() * 100) + 1;
			//console.log("roll: " + roll + " chanceToInterrupt: " + chanceToInterrupt); // informative logging for dev purposes
			if(roll <= chanceToInterrupt) {
				gagInterruptUsed = true;
				
				//randomly choose interruption message
				let msgIndex = Math.floor(Math.random() * ringGagInterruptList.length);
				// convert and add the message to interrupt
                output = `${output.slice(0, -1)}-` // Replace the last space with a - to indicate an interrupt!
				output += convertPronounsText(ringGagInterruptList[msgIndex], { serverID: msg.guild.id, interactionuser: msg.member });
				output += " ";
			}
			
		}
		
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
