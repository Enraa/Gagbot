const { getMitten } = require("./getMitten");

/******
 * Gets the person who put mittens on a user. This is used in one place and should be retired.
 * 
 * - (user ID) userID - The user ID to retrieve the mittens for
 * ---
 * ##### Returns the user ID who put the mittens on the user.
 ******/
function getMittenBinder(userID) {
	return getMitten(userID)?.origbinder;
}

exports.getMittenBinder = getMittenBinder;