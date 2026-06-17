const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getChastity } = require("./getChastity");

/***********
 * Returns UNIX timestring of the wearer's unlock time for their chastity belt if they are timelocked.
 * 
 * - (server id) serverID - The server this is running on 
 * - (user id) user - The User ID wearing the chastity belt.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the unlockTime or a string with the unlock time for Discord.
 ***********/
function getChastityTimelock(serverID, user, UNIXTimestring) {
    traceFirstParam(arguments[0]);
	if (!UNIXTimestring) {
		return getChastity(serverID, user)?.unlockTime;
	} else {
		if (getChastity(serverID, user)?.unlockTime) {
			return `<t:${Math.floor(getChastity(serverID, user)?.unlockTime / 1000)}:f>`;
		} else {
			return null;
		}
	}
}

exports.getChastityTimelock = getChastityTimelock;