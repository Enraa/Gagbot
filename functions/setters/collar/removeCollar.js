/********
 * Removes a collar from a user
 * 
 * - (user id) user - The user wearing the collar
 * ---
 * ##### *No return value*
 ********/
function removeCollar(user) {
    if (process.collar == undefined) {
		process.collar = {};
	}
	delete process.collar[user];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.collar = true;
}

exports.removeCollar = removeCollar;