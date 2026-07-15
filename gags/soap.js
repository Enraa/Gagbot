const garbleText = (text, parent, locarr, intensity) => {
	let curses = ["fuck", "fucking", "fuckin", "motherfucker", "damn", "dammit", "bitch", "shit", "bitchin'", "ass", "asshole", "arse", "goddammit", "piss", "dick", "dickhead", "damned", "bullshit", "fucked", "fucker", "crap", "hell", "cunt", "bollocks", "slut", "sluts", "idiot"];

	let cursemap = curses.join("|");
	let regexpattern = new RegExp(`\\b(${cursemap})\\b`, "gi");
	let textout = text.replaceAll(regexpattern, "🧼".repeat(Math.floor(intensity / 2)));

	return textout;
};

exports.garbleText = garbleText;
exports.breathRecovery = (_user, intensity) => 1 - intensity / 30;
exports.choicename = "Soap Gag";
