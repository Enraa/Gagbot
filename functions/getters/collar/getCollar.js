const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/*********
 * Gets the worn collar for a user. Returns the collar if it exists, or undefined if not.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user ID of the collar to retrieve
 * ---
 * ##### Returns the collar object for the user. All collar objects will have these properties:
 * - keyholder: User ID of the person who has the key for this collar
 * - keyholder_only: If false, this collar is "Free Use" or public access. If true, only the keyholder can access it
 * - collartype: The collar ID of this collar
 * - timestamp: The time this collar was applied to the wearer
 * - mitten: Permission to mitten the user
 * - chastity: Permission to apply chastity devices to the user
 * - heavy: Permission to apply heavy bondage to the user
 * - mask: Permission to apply headwear to the user
 * ###### Additional properties may be added by other functions
 *********/
function getCollar(serverID, user) {
    traceFirstParam(arguments[0])
    return getProcessVariable(serverID, user, "collar")
};

exports.getCollar = getCollar;