const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getChastityBra } = require("./getChastityBra");

/***********
 * Returns UNIX timestring of the wearer's unlock time for their chastity bra if they are timelocked.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The User ID wearing the chastity bra.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the unlockTime or a string with the unlock time for Discord.
 ***********/
function getChastityBraTimelock(serverID, userID, UNIXTimestring) {
    traceFirstParam(arguments[0]);
    if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	if (!UNIXTimestring) {
		return getChastityBra(serverID, user)?.unlockTime;
	} else {
		if (getChastityBra(serverID, user)?.unlockTime) {
			return `<t:${Math.floor(getChastityBra(serverID, user)?.unlockTime / 1000)}:f>`;
		} else {
			return null;
		}
	}
}

exports.getChastityBraTimelock = getChastityBraTimelock;