const { getBotOption } = require("../config/getBotOption");
const { getOption } = require("../config/getOption");

// the arousal needed for an unbelted user to orgasm
const ORGASM_LIMIT = 10;

/**********
 * Gets a description representing the user's arousal change
 * 
 * - (user id) user - The user who is aroused
 * ---
 * ##### Returns a string representing their arousal change
 **********/
function getArousalChangeDescription(user) {
	if (getOption(user, "arousalsystem") != 2) return null;

	const arousal = process.arousal[user];
	if (!arousal) return null;
	const lastChange = (arousal.arousal - arousal.prev) / (getBotOption("bot-timetickrate") / 60000);
	if (Math.abs(lastChange) < 0.01) return null;
	// these numbers are mostly arbitrary
	if (lastChange < -2) return "and cooling off rapidly";
	if (lastChange < 0) return "and cooling off";
	if (lastChange < 2) return "and getting a little turned on";
	if (lastChange < ORGASM_LIMIT * 5) return "and getting very hot";
	return "and rushing to the peaks";
}

exports.getArousalChangeDescription = getArousalChangeDescription;