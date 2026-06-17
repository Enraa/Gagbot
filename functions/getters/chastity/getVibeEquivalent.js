const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { calcStaticVibeIntensity, calcFrustration } = require("../../vibefunctions");
const { getArousal } = require("../arousal/getArousal");
const { getOption } = require("../config/getOption");

// the minimum arousal required for frustration to also impact speech
const STUTTER_LIMIT = 1;

/***********
 * Calculate the effective arousal for the user based on their current frustration
 * 
 * - (server id) serverID - The server this is on
 * - (user id) user - The user that is aroused
 * ---
 * ##### Returns a value of arousal with their added frustration
 ***********/
function getVibeEquivalent(serverID, user) {
    traceFirstParam(arguments[0]);
	if (getOption(serverID, user, "arousalsystem") != 2) return calcStaticVibeIntensity(serverID, user) * 2;

	let intensity = getArousal(serverID, user);
	if (intensity >= STUTTER_LIMIT) intensity += calcFrustration(serverID, user) / 20;
	return intensity;
}

exports.getVibeEquivalent = getVibeEquivalent;