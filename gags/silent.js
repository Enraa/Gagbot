/***************************
 * High-Security Ball Gag for Gagbot
 * ~ Punyo
 ***************************/

const garbleText = (text, intensity) => {
	let output = "-# ";
	let leakedSound = 0;

	let escapedText = false;
	let escapeChar = "*"; // Do NOT have an escapeChar in the character map above.
	for (const char of text) {
		if (char == escapeChar) {
			escapedText = !escapedText;
		}
		if (char == " " && leakedSound == 0 && Math.random() > 0.2 + 0.065 * intensity) {
			leakedSound = 1;
			output += " ";
			continue;
		}

		// Edit the text if we are not escaped
		if (!escapedText) {
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
	}
	if (leakedSound > 1) {
		output += "! ";
	}

	return output;
};

exports.garbleText = garbleText;
exports.breathRecovery = (_user, intensity) => 1 - intensity / 12;
exports.choicename = "Silent Panel Gag";
