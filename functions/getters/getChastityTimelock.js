/***********
 * Returns UNIX timestring of the wearer's unlock time for their chastity belt if they are timelocked.
 * 
 * - (user id) user - The User ID wearing the chastity belt.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the unlockTime or a string with the unlock time for Discord.
 ***********/
function getChastityTimelock(user, UNIXTimestring) {
    if (process.chastity == undefined) {
		process.chastity = {};
	}
	if (!UNIXTimestring) {
		return process.chastity[user]?.unlockTime;
	} else {
		if (process.chastity[user]?.unlockTime) {
			return `<t:${Math.floor(process.chastity[user]?.unlockTime / 1000)}:f>`;
		} else {
			return null;
		}
	}
}

exports.getChastityTimelock = getChastityTimelock;