const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getChastityBra } = require("./getChastityBra");

/***********
 * Returns UNIX timestring of the wearer's fumbled unlock time. As this is small, the default return is using relative time instead of date stamps. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User ID wearing the chastity bra.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the fumbled or a string with the fumbled unlock time for Discord.
 ***********/
function getChastityBraTempTimelock(serverID, user, UNIXTimestring) {
    traceFirstParam(arguments[0]);
	if (!UNIXTimestring) {
		return getChastityBra(serverID, user)?.temporarykeyholdertime;
	} else {
		if (getChastityBra(serverID, user)?.temporarykeyholdertime) {
			return `<t:${Math.floor((getChastityBra(serverID, user)?.temporarykeyholdertime) / 1000)}:R>`;
		} else {
			return null;
		}
	}
}

exports.getChastityBraTempTimelock = getChastityBraTempTimelock;