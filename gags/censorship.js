function garbleText(text, intensity) {
	let prefix = "";
	let out = [];
	let ignore = false;
	let censor = Math.random() < intensity / 10;
	let ignoreNext = false;
	let lastChar = null;

	const match = text.match(/^(-?#+\s)/);
	if (match) {
		prefix = match[1];
		text = text.substring(prefix.length);
	}

	for (const char of text) {
		if (char == "") {
			out.push(char);
			ignore = !ignore;
			lastChar = null;
		}
		if (ignore) {
			out.push(char);
			continue;
		}
		if (char == " ") {
			censor = Math.random() < intensity / 10;
			ignoreNext = Math.random() > intensity / 20;
			if (lastChar && Math.random() > intensity / 20) out[out.length - 1] = lastChar;
			lastChar = null;
			out.push(char);
			continue;
		}
		if (ignoreNext) {
			out.push(char);
			ignoreNext = false;
			continue;
		}
		if (censor) out.push("█");
		else out.push(char);
		lastChar = char;
	}

	return prefix + out.join("");
}

exports.garbleText = garbleText;
exports.choicename = "Censorship Gag";
