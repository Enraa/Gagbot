const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getCollar } = require("./getCollar");

/***********
 * Returns UNIX timestring of the wearer's unlock time for their collar if they are timelocked.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User ID wearing the collar.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the unlockTime or a string with the unlock time for Discord.
 ***********/
function getCollarTimelock(serverID, user, UNIXTimestring) {
    traceFirstParam(arguments[0]);
	if (!UNIXTimestring) {
		return getCollar(serverID, user)?.unlockTime;
	} else {
		if (getCollar(serverID, user)?.unlockTime) {
			return `<t:${Math.floor(getCollar(serverID, user)?.unlockTime / 1000)}:f>`;
		} else {
			return null;
		}
	}
}

exports.getCollarTimelock = getCollarTimelock;