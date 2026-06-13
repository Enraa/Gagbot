/********
 * Removes a corset from a user
 * 
 * - (user id) user - The user wearing the corset
 * ---
 * ##### *No return value*
 ********/
function removeCorset(user) {
	if (process.corset == undefined) process.corset = {};
	delete process.corset[user];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.corset = true;
};

exports.removeCorset = removeCorset;