const garble = require("garble");

const garbleText = (text, parent, intensity) => {
	let garbled = garble(text, Math.max(intensity-5, intensity), Math.max(intensity-5, intensity * 2)).slice(0,1900) // If its a singular text, reduce to 1900 lol

    return garbled;
};

exports.garbleText = garbleText;
exports.breathRecovery = (_user, intensity) => 1 - intensity / 60;
exports.choicename = "Eldritch Gag";
