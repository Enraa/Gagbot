const apologies = [
    "sorry",
    "sorries",
    "sowry",
    "sowwy",
    "my\ bad",
    "apologies",
    "I\ should\ apologize",
    "I\ apologize",
    "I'm\ being\ selfish"
];

const affirmations = [
    `\nI am enough.\n`, 
    `\nI do fantastic work.\n`, 
    `\nMy actions are good enough.\n`, 
    `\nI am a great person.\n`, 
    `\nI am beautiful.\n`, 
    `\nI am cute.\n`, 
];

const messagebegin = (msgcontent, intensity, msgparts) => {
	let apologiesmap = apologies.join("|");
	let regexpattern = new RegExp(`\\b(${apologiesmap})\\b`, "i");

	if (!regexpattern.test(msgcontent)) {
		// They did not apologize, no need to do anything. 
		return { msgparts: msgparts };
	} else {
		let msgpartschanged = msgparts.slice(0);
		let silented = false;
		for (let i = 0; i < msgpartschanged.length; i++) {
			// Twiddle their thumbs
			if (!silented && msgpartschanged[i].garble && msgpartschanged[i].text.length > 0 && !msgpartschanged[i].text.match(/^\s*$/)) {
				msgpartschanged[i].text = affirmations[Math.floor(Math.random() * affirmations.length)];
				msgpartschanged[i].garble = false;
				silented = true;
			}
			// Theyve been silenced, no more speech.
			else if (msgpartschanged[i].garble) {
				msgpartschanged[i].text = "";
			}
		}
		return { msgparts: msgpartschanged };
	}
};

// Replace the first rawText field with a silenttitle, then purge all others.
const impoliteSub = (text, parent, silent) => {
	if(!silent.isSilenced){
		silent.isSilenced = true;
		return affirmations[Math.floor(Math.random() * silenttitles.length)];
	}else{
		return "";
	}
}

//exports.garbleText = garbleText;
exports.messagebegin = messagebegin;
exports.choicename = "Sorry Gag";
