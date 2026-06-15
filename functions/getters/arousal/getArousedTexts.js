const { arousedtexts } = require("../../../vibes/aroused/aroused_texts");
const { calcStaticVibeIntensity } = require("../../vibefunctions");
const { getOption } = require("../config/getOption");

/*********
 * Returns valid arousal texts to be used when stuttering during speech
 * 
 * - (user id) user - The user that is aroused
 * ---
 * ##### Returns an array of strings with aroused texts
 *********/
function getArousedTexts(user) {
	const texts = [];

	if (getOption(user, "arousalsystem") == 2) {
		const arousal = process.arousal[user];
		const current = arousal.arousal;
		const change = arousal.arousal - arousal.prev;
		for (const [min, max, minChange, maxChange, text] of arousedtexts) {
			if ((min < 0 || min <= current) && (max < 0 || max >= current) && (minChange < 0 || minChange <= change) && (maxChange < 0 || maxChange >= change)) texts.push(text);
		}
	} else {
		const arousal = calcStaticVibeIntensity(user);

		for (const [min, max, _0, _1, text] of arousedtexts) {
			if ((min < 0 || min <= arousal) && (max < 0 || max >= arousal)) texts.push(text);
		}
	}

	return texts;
}

exports.getArousedTexts = getArousedTexts