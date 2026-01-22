const messagebegin = (msgcontent, intensity, msgparts) => {
	let honorifictitles = [
		// Oh god its hard to type these without caps
		"miss",
		"master",
		"masters",
		"sir",
		"sirs",
		"ma\'am",
		"maam",
		"lady",
		"ladies",
		"lord",
		"lords",
		"queen",
		"queens",
		"king",
		"kings",
		"mistress",
		"mistresses",
		"goddess",
		"goddesses",
		"maitresse",
		"administrator",
		"administrators",
		"mommy",
		"mommies",
		"daddy",
		"daddies",
		"mxtress",
		"overseer",
		"headmaid",
		"head\ maid",
		"mx",
		"duke",
		"dukes",
		"dame",
		"count",
		"overlord",
		"(\\w|\\d)+-sama",
		"(\\w|\\d)+-sensei",
		"(\\w|\\d)+-san",
		"(\\w|\\d)+-senpai",
	];

	let silenttitles = [`\n*looks down silently*\n`, `\n*tries to speak, but no words come out*\n`, `\n*nods without a word*\n`, `\n*looks down and to the side*\n`, `\n*twiddles thumbs meekly*\n`, `\n*pouts as the gag stops impolite speech*\n`, `\n*goes mute without an honorific*\n`, `\n*meeps but produces no audible words*\n`, `\n*casts eyes downward, like a good sub*\n`, `\n*blushes and mumbles something*\n`];

	let garblemode = false;
	let textout = silenttitles[Math.floor(Math.random() * silenttitles.length)];

	let honorificsmap = honorifictitles.join("|");
	let regexpattern = new RegExp(`\\b(${honorificsmap})\\b`, "i");

	if (regexpattern.test(msgcontent)) {
		// They were polite, don't touch it.
		return { msgparts: msgparts };
	} else {
		let msgpartschanged = msgparts.slice(0);
		let silented = false;
		for (let i = 0; i < msgpartschanged.length; i++) {
			// Twiddle their thumbs
			if (!silented && msgpartschanged[i].garble && msgpartschanged[i].text.length > 0 && !msgpartschanged[i].text.match(/^\s*$/)) {
				msgpartschanged[i].text = silenttitles[Math.floor(Math.random() * silenttitles.length)];
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

//exports.garbleText = garbleText;
exports.messagebegin = messagebegin;
exports.choicename = "Polite Sub Gag";
