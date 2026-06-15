const { getCorset } = require("./getCorset");

/**********
 * Gets the origbinder of someone's corset, if worn.
 * 
 * - (user id) user - The user wearing the corset
 * ---
 * ##### Returns the user ID of the person who put this corset on the wearer.
 **********/
function getCorsetBinder(user) {
	return getCorset(user)?.origbinder;
}

exports.getCorsetBinder = getCorsetBinder;