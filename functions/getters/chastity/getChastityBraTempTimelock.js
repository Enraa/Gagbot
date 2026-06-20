const { getOption } = require("../config/getOption");
const { getChastityBra } = require("./getChastityBra");

/***********
 * Returns UNIX timestring of the wearer's fumbled unlock time. As this is small, the default return is using relative time instead of date stamps. 
 * 
 * - (user id) user - The User ID wearing the chastity bra.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the fumbled or a string with the fumbled unlock time for Discord.
 ***********/
function getChastityBraTempTimelock(user, UNIXTimestring) {
	if (!UNIXTimestring) {
		return getChastityBra(user)?.temporarykeyholdertime;
	} else {
		if (getChastityBra(user)?.temporarykeyholdertime) {
			return `<t:${Math.floor((getChastityBra(user)?.temporarykeyholdertime) / 1000)}:R>`;
		} else {
			return null;
		}
	}
}

exports.getChastityBraTempTimelock = getChastityBraTempTimelock;