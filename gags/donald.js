const { processChunks } = require("./../functions/gag_utilities.js");
// import { processChunks } from "./gag_utilities.js";

const DONALDSOUNDS = ["pwah", "muawh", "ghuaw", "haa", "puahh", "bwahh", "phwahh", "phahhh", "mwaahhh", "mah", "pah", "bhahh", "bah", "ghhaa", "gahh", "ghah", "bwahh"];
const DONALDFACES = [" :V ", " :V ", " >:V ", " :V ", " >:V ", " o<o ", " º<º "];

const garbleText = (text) => {
	//https://stackoverflow.com/questions/49403285/splitting-word-into-syllables-in-javascript
	const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;

	text = processChunks(text, (chunk) => {
		if (chunk.startsWith(":") && chunk.endsWith(":")) {
			return chunk;
		}
		if (!chunk.match(/[aeiouyAEIOUY]/)) {
			return chunk;
		}

		return Array.from(chunk.match(syllableRegex))
			.map((syllable) => {
				return DONALDSOUNDS[Math.floor(Math.random() * DONALDSOUNDS.length)];
			})
			.join("");
	});

	let matchesEnd = text.matchAll(/[.,;?!]\s+/g);
	matchesEnd = Array.from(matchesEnd);
	matchesEnd = matchesEnd.concat(text.matchAll(/[\n\r]+/g) || []);
	for (const match of matchesEnd) {
		if (Math.random() > 0.25) {
			text = text.replace(match[0], match[0] + DONALDFACES[Math.floor(Math.random() * DONALDFACES.length)]);
		}
	}

	return text;
};

exports.garbleText = garbleText;
exports.choicename = "Donald Gag";

// export const choicename = "Donald Gag";
