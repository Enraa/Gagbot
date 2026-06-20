const { getCollar } = require("./getCollar");

/***********
 * Returns UNIX timestring of the wearer's fumbled unlock time. As this is small, the default return is using relative time instead of date stamps. 
 * 
 * - (user id) user - The User ID wearing the collar.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the fumbled or a string with the fumbled unlock time for Discord.
 ***********/
function getCollarTempTimelock(user, UNIXTimestring) {
	if (!UNIXTimestring) {
		return getCollar(user)?.temporarykeyholdertime;
	} else {
		if (getCollar(user)?.temporarykeyholdertime) {
			return `<t:${Math.floor(getCollar(user)?.temporarykeyholdertime / 1000)}:R>`;
		} else {
			return null;
		}
	}
}

exports.getCollarTempTimelock = getCollarTempTimelock;