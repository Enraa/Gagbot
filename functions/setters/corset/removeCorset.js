const { markForSave } = require("../../other/markForSave");

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
	markForSave("corset");
};

exports.removeCorset = removeCorset;