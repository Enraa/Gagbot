const outOfTimeMessages = [`*looks down silently*`, `*tries to speak, but no words come out*`, `*nods without a word*`, `*looks down and to the side*`, `*needs to track time better*`, `*is out of time*`, `*should have waited more*`, `*meeps but produces no audible words*`, `*waits to speak*`, `*does not speak out of turn*`];

function messagebegin (msg, msgTree, msgTreeMods, intensity) {
	const duration = 20 - intensity;
	const period = 25 + 7 * intensity;

	console.log("is called")
	if (Math.floor(Date.now() / 1000) % period < duration) return;

	let silenced = {"isSilenced":false}
	msgTree.callFunc(outOfTime,true,["rawText","moan"],[silenced])	// Run a function on the tree.
	if(silenced.isSilenced){
		msgTreeMods.modified = true;						// If the function caught anything, the message is modified.
		msgTree.rebuild(`${msgTree.toString()}${`\n-# (${period - (Math.floor(Date.now() / 1000) % period)} Second${period - (Math.floor(Date.now() / 1000) % period) == 1 ? "" : "s"} Remaining...)`}`)
	}
	return;
}

// Replace the first rawText field with a silenttitle, then purge all others.
const outOfTime = (text, parent, silent) => {
	if(!silent.isSilenced){
		silent.isSilenced = true;
		return `\n${outOfTimeMessages[Math.floor(Math.random() * outOfTimeMessages.length)]}`;
	}else{
		return "";
	}
}

exports.messagebegin = messagebegin;
exports.breathRecovery = (_user, intensity) => {
	const duration = 20 - intensity;
	const period = 25 + 7 * intensity;
	if (Math.floor(Date.now() / 1000) % period < duration) return 1;
	return 0;
};
exports.choicename = "Clockmaker's Gag";
