/*********
 * Gets the worn collar for a user. Returns the collar if it exists, or undefined if not.
 * 
 * - (user id) user - The user ID of the collar to retrieve
 * ---
 * ##### Returns the collar object for the user. All collar objects will have these properties:
 * - keyholder: User ID of the person who has the key for this collar
 * - keyholder_only: If false, this collar is "Free Use" or public access. If true, only the keyholder can access it
 * - collartype: The collar ID of this collar
 * - timestamp: The time this collar was applied to the wearer
 * - mitten: Permission to mitten the user
 * - chastity: Permission to apply chasitity devices to the user
 * - heavy: Permission to apply heavy bondage to the user
 * - mask: Permission to apply headwear to the user
 * ###### Additional properties may be added by other functions
 *********/
function getCollar(user) {
	if (process.collar == undefined) {
		process.collar = {};
	}
    if (process.collar[user] && !process.collar[user].timestamp) {
        process.collar[user].timestamp = Date.now();
        if (process.readytosave == undefined) {
            process.readytosave = {};
        }
        process.readytosave.collar = true;
    }
	return process.collar[user];
};

exports.getCollar = getCollar;