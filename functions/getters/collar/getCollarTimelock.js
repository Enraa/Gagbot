const { getCollar } = require("./getCollar");

/***********
 * Returns UNIX timestring of the wearer's unlock time for their collar if they are timelocked.
 * 
 * - (user id) user - The User ID wearing the collar.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the unlockTime or a string with the unlock time for Discord.
 ***********/
function getCollarTimelock(user, UNIXTimestring) {
	if (!UNIXTimestring) {
		return getCollar(user)?.unlockTime;
	} else {
		if (getCollar(user)?.unlockTime) {
			return `<t:${Math.floor(getCollar(user)?.unlockTime / 1000)}:f>`;
		} else {
			return null;
		}
	}
}

exports.getCollarTimelock = getCollarTimelock;