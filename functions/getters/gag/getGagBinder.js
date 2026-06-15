const { getGag } = require("./getGag");

/*****
 * Gets the original binder for a gag by ID
 * 
 * - (user ID) userID - The user ID to retrieve a gag for
 * - (string) item - The string ID of the gag to get. 
 * ---
 * ##### Returns the user ID who put the gag on them
 *****/
function getGagBinder(userID, item) {
	return getGag(userID, item)?.origbinder;
}

exports.getGagBinder = getGagBinder;