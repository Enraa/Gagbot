/***************************
 * L337 Gag for Gagbot
 * ~ Pyra (Based on DollLia's Ball Gag)
 ***************************/

// Character maps stored in an array in a separate file for code cleanliness
const { leetGagCharMaps } = require("./leet/leetCharMap.js");

// Helper function to garble a text segment.
const garbleText = (text, intensity) => {
	let output = "";
	let itr = 0;
	for (const char of text) {
		if (char.match(/[A-Za-z]/)) {
			let newChar = leetGagCharMaps[Math.ceil(intensity / 2) - 1].get(char.toLowerCase());
			if (newChar) {
				// Converted Char
				output += newChar;
			} else {
				// Unmapped Char
				output += char;
			}
		} else {
			// Non-alpha Char
			output += char;
		}
	}

	return output;
};

exports.garbleText = garbleText;
exports.choicename = "L337 Gag";

// Unit Tests

//Test Gag Intensities

//let TestStr1 = "Testing the conversion of Alphabet to leet speak. a b c d e f g h i j k l m n o p q r s t u v w x y z  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
//let TestStr2 = "On a completely different note... how messy is this to read?";
//let TestStr3 = "It should be an amusing one to use however, probably especially for when they're wearing a Doll Visor~";

// console.log(`Original:     ${TestStr1}\n`)
// console.log(`Intensity 1-2:   ${garbleText(TestStr1, 1)}`)
// console.log(`Intensity 3-4:   ${garbleText(TestStr1, 3)}`)
// console.log(`Intensity 5-6:   ${garbleText(TestStr1, 5)}`)
// console.log(`Intensity 7-8:   ${garbleText(TestStr1, 7)}`)
// console.log(`Intensity 9-10:  ${garbleText(TestStr1, 9)}`)

// console.log(`\nOriginal:     ${TestStr2}\n`)
// console.log(`Intensity 1-2:   ${garbleText(TestStr2, 2)}`)
// console.log(`Intensity 3-4:   ${garbleText(TestStr2, 4)}`)
// console.log(`Intensity 5-6:   ${garbleText(TestStr2, 6)}`)
// console.log(`Intensity 7-8:   ${garbleText(TestStr2, 8)}`)
// console.log(`Intensity 9-10:  ${garbleText(TestStr2, 10)}`)

// console.log(`\nOriginal:     ${TestStr3}\n`)
// console.log(`Intensity 1-2:   ${garbleText(TestStr3, 1)}`)
// console.log(`Intensity 3-4:   ${garbleText(TestStr3, 3)}`)
// console.log(`Intensity 5-6:   ${garbleText(TestStr3, 5)}`)
// console.log(`Intensity 7-8:   ${garbleText(TestStr3, 7)}`)
// console.log(`Intensity 9-10:  ${garbleText(TestStr3, 9)}`)
