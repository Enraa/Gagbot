const { arousedtexts } = require("../../../vibes/aroused/aroused_texts");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { calcStaticVibeIntensity } = require("../../vibefunctions");
const { getOption } = require("../config/getOption");
const { getProcessVariable } = require("../config/getProcessVariable");

/*********
 * Returns valid arousal texts to be used when stuttering during speech
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user that is aroused
 * ---
 * ##### Returns an array of strings with aroused texts
 *********/
function getArousedTexts(serverID, user) {
    traceFirstParam(arguments[0]);
	const texts = [];

	if (getOption(serverID, user, "arousalsystem") == 2) {
		const arousal = getProcessVariable(serverID, user, "arousal");
		const current = arousal.arousal;
		const change = arousal.arousal - arousal.prev;
		for (const [min, max, minChange, maxChange, text] of arousedtexts) {
			if ((min < 0 || min <= current) && (max < 0 || max >= current) && (minChange < 0 || minChange <= change) && (maxChange < 0 || maxChange >= change)) texts.push(text);
		}
	} else {
		const arousal = calcStaticVibeIntensity(serverID, user);

		for (const [min, max, _0, _1, text] of arousedtexts) {
			if ((min < 0 || min <= arousal) && (max < 0 || max >= arousal)) texts.push(text);
		}
	}

	return texts;
}

exports.getArousedTexts = getArousedTexts