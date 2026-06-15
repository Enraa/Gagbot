const { getCollar } = require("../../getters/collar/getCollar");
const { markForSave } = require("../../other/markForSave");

/********
 * Adds a user as a cloned keyholder for the collar
 * 
 * - (user id) collarUser - The user wearing the collar
 * - (user id) newKeyholder - The user added to the collar's cloned keys
 * ---
 * ##### *No return value*
 ********/
function cloneCollarKey(collarUser, newKeyholder) {
    let collar = getCollar(collarUser);
	if (!collar.clonedKeyholders) {
		collar.clonedKeyholders = [];
	}
	collar.clonedKeyholders.push(newKeyholder);
	markForSave("collar");
};

exports.cloneCollarKey = cloneCollarKey;