/***************************
 * High-Security Ball Gag for Gagbot
 * ~ Punyo
 ***************************/

const garbleText = (text, parent, locarr, intensity) => {
	let output = "";
	let leakedSound = 0;

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

exports.garbleText = garbleText;
exports.breathRecovery = (_user, intensity) => 1 - intensity / 12;
exports.choicename = "Silent Panel Gag";
