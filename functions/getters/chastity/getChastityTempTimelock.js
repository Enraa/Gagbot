const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getChastity } = require("./getChastity");

/***********
 * Returns UNIX timestring of the wearer's fumbled unlock time. As this is small, the default return is using relative time instead of date stamps. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User ID wearing the chastity belt.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the fumbled or a string with the fumbled unlock time for Discord.
 ***********/
function getChastityTempTimelock(serverID, user, UNIXTimestring) {
    traceFirstParam(arguments[0]);
	if (!UNIXTimestring) {
		return getChastity(serverID, user)?.temporarykeyholdertime;
	} else {
		if (getChastity(serverID, user)?.temporarykeyholdertime) {
			return `<t:${Math.floor(getChastity(serverID, user)?.temporarykeyholdertime / 1000)}:R>`;
		} else {
			return null;
		}
	}
}

exports.getChastityTempTimelock = getChastityTempTimelock;