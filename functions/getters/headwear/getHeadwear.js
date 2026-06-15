/*******
 * Get the worn headwear for a user
 * 
 * - (user id) userID - The user that's wearing the head gear
 * ---
 * ##### Returns an array with string item IDs the user is wearing
 *******/
function getHeadwear(userID) {
    if (process.headwear == undefined) {
		process.headwear = {};
	}
	return process.headwear[userID]?.wornheadwear ? process.headwear[userID]?.wornheadwear : [];
}

exports.getHeadwear = getHeadwear;