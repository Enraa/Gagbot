/********
 * Gets the person who put a piece of headwear on the user
 * 
 * - (user id) userID - The person wearing the headgear
 * - (string) item - The item ID to check 
 * ---
 * ##### Returns the user ID who put this headgear on the wearer
 ********/
function getHeadwearBinder(userID, item) {
    if (process.headwear == undefined) {
		process.headwear = {};
	}
	return (process.headwear[userID] && process.headwear[userID][item]?.origbinder);
}

exports.getHeadwearBinder = getHeadwearBinder;