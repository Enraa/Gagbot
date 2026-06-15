const { markForSave } = require("../../other/markForSave");

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
	markForSave("collar");
}

exports.removeCollar = removeCollar;