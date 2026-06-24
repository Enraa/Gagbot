const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getCollar } = require("./getCollar");

/***********
 * Returns UNIX timestring of the wearer's fumbled unlock time. As this is small, the default return is using relative time instead of date stamps. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User ID wearing the collar.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the fumbled or a string with the fumbled unlock time for Discord.
 ***********/
function getCollarTempTimelock(serverID, user, UNIXTimestring) {
    traceFirstParam(arguments[0]);
	if (!UNIXTimestring) {
		return getCollar(serverID, user)?.temporarykeyholdertime;
	} else {
		if (getCollar(serverID, user)?.temporarykeyholdertime) {
			return `<t:${Math.floor(getCollar(serverID, user)?.temporarykeyholdertime / 1000)}:R>`;
		} else {
			return null;
		}
	}
}

exports.getCollarTempTimelock = getCollarTempTimelock;