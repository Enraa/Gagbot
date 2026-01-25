const apologies = [
    "(s-)*s+o+r+y+",
    "(s-)*s+o+r+i+e+s+",
    "(s-)*s+o+w+r+y+",
    "(s-)*s+o+w+y+",
    "my\ bad",
    "apologies",
    "I\ should\ apologize",
    "I\ apologize",
    "I'm\ being\ selfish",
    "(s-)*s+o+r+",
    "(s-)*s+o+r+",
    "(s-)*s+o+r+-",
    "soz+"
];

const affirmations = [
    `I am enough.`, 
    `I do fantastic work.`, 
    `My actions are good enough.`, 
    `I am a great person.`, 
    `I am beautiful.`, 
    `I am cute.`, 
];

const messagebegin = (msg, msgTree, msgTreeMods, intensity) => {
	let apologiesmap = apologies.join("|");
	let regexpattern = new RegExp(`\\b(${apologiesmap})\\b`, "i");


	if (!regexpattern.test(msg.content)) {
		// They did not apologize, no need to do anything.
		return;
	} else {
		let silenced = {"isSilenced": false}								// Store a bool in an object to pass by reference.
		msgTree.callFunc(impoliteSub,true,["rawText","moan"],[silenced])	// Run a function on the tree.
		if(silenced.isSilenced){msgTreeMods.modified = true;}				// If the function caught anything, the message is modified.
		return;
	}
};

// Replace the first rawText field with a silenttitle, then purge all others.
const impoliteSub = (text, parent, silent) => {
	if(!silent.isSilenced){
		silent.isSilenced = true;
		return affirmations[Math.floor(Math.random() * affirmations.length)];
	}else{
		return "";
	}
}

//exports.garbleText = garbleText;
exports.messagebegin = messagebegin;
exports.choicename = "Sorry Gag";
