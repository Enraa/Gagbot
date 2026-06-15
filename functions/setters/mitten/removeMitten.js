const { markForSave } = require("../../other/markForSave");

/**********
 * Removes mittens from the user.
 * 
 * - (user id) userID - The person wearing the mittens
 * ---
 * ##### *No return value*
 **********/
function deleteMitten(userID) {
	if (process.mitten == undefined) {
		process.mitten = {};
	}
	delete process.mitten[userID];
	markForSave("mitten");
};

exports.deleteMitten = deleteMitten;
exports.removeMitten = deleteMitten;