const outOfTimeMessages = [`\n*looks down silently*\n`, `\n*tries to speak, but no words come out*\n`, `\n*nods without a word*\n`, `\n*looks down and to the side*\n`, `\n*needs to track time better*\n`, `\n*is out of time*\n`, `\n*should have waited more*\n`, `\n*meeps but produces no audible words*\n`, `\n*waits to speak*\n`, `\n*does not speak out of turn*\n`];

function messagebegin(_msgcontent, intensity, msgparts) {
	const duration = 20 - intensity;
	const period = 25 + 7 * intensity;

	if (Math.floor(Date.now() / 1000) % period < duration) return { msgparts: msgparts };

	let msgpartschanged = msgparts.slice(0);
	let silenced = false;
	for (let i = 0; i < msgpartschanged.length; i++) {
		if (!silenced && msgpartschanged[i].garble && msgpartschanged[i].text.length > 0 && !msgpartschanged[i].text.match(/^\s*$/)) {
			msgpartschanged[i].text = `\n${outOfTimeMessages[Math.floor(Math.random() * outOfTimeMessages.length)]}`;
			msgpartschanged[i].garble = false;
			silenced = true;
		} else if (msgpartschanged[i].garble) {
			msgpartschanged[i].text = "";
			msgpartschanged[i].garble = false;
		}
	}
	msgpartschanged.push({ text: `\n-# (${period - (Math.floor(Date.now() / 1000) % period)} Second${period - (Math.floor(Date.now() / 1000) % period) == 1 ? "" : "s"} Remaining...)`, garble: false });
	return { msgparts: msgpartschanged };
}

exports.messagebegin = messagebegin;
exports.breathRecovery = (_user, intensity) => {
	const duration = 20 - intensity;
	const period = 25 + 7 * intensity;
	if (Math.floor(Date.now() / 1000) % period < duration) return 1;
	return 0;
};
exports.choicename = "Clockmaker's Gag";
