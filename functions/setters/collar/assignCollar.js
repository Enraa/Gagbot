/**********
 * Adds or modifies a collar on the user.
 * 
 * - (user id) user - The person wearing the collar
 * - (user id) keyholder - The person putting the collar on them
 * - (object) restraints - The restraint bypasses (mitten, chastity, heavy, mask) permitted on the collar
 * - (boolean) only - If true, the collar will not be set to public access
 * - (string) customcollar - The collar type to wear
 * ---
 * ##### *No return value*
 **********/
function assignCollar(user, keyholder, restraints, only, customcollar) {
    if (process.collar == undefined) {
		process.collar = {};
	}
	process.collar[user] = { 
        keyholder: keyholder, 
        keyholder_only: only, 
        mitten: restraints?.mitten, 
        chastity: restraints?.chastity, 
        heavy: restraints?.heavy, 
        mask: restraints?.mask, 
        collartype: customcollar,
        timestamp: Date.now()
    };
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.collar = true;
}

exports.assignCollar = assignCollar;