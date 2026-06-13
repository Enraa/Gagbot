/***********
 * Calculate the effective arousal for the user based on their current frustration
 * 
 * - (user id) user - The user that is aroused
 * ---
 * ##### Returns a value of arousal with their added frustration
 ***********/
function getVibeEquivalent(user) {
	if (!config.getDynamicArousal(user)) return calcStaticVibeIntensity(user) * 2;

	let intensity = getArousal(user);
	if (intensity >= STUTTER_LIMIT) intensity += calcFrustration(user) / 20;
	return intensity;
}

exports.getVibeEquivalent = getVibeEquivalent;