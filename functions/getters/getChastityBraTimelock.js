/***********
 * Returns UNIX timestring of the wearer's unlock time for their chastity bra if they are timelocked.
 * 
 * - (user id) user - The User ID wearing the chastity bra.
 * - (boolean) UNIXTimestring? - If true, returns a Discord UNIX timestring instead
 * ---
 * ##### Returns an integer with the unlockTime or a string with the unlock time for Discord.
 ***********/
function getChastityBraTimelock(user, UNIXTimestring) {
    if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	if (!UNIXTimestring) {
		return process.chastitybra[user]?.unlockTime;
	} else {
		if (process.chastitybra[user]?.unlockTime) {
			return `<t:${Math.floor(process.chastitybra[user]?.unlockTime / 1000)}:f>`;
		} else {
			return null;
		}
	}
}

exports.getChastityBraTimelock = getChastityBraTimelock;