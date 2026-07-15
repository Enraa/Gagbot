const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getBaseCollar } = require("./getBaseCollar");
const { getCollar } = require("./getCollar");

/************
 * Gets the full collar name of the User ID. Optionally will get the full collar name of a collar by ID.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The User ID to get the collar name of
 * - (string) collarid - The collar ID to retrieve the collar name of
 * ##### *Note: This function should use either/or param, not both.*
 * ---
 * ##### Returns a string with the user-facing display name of the collar.
 * ---
 * ###### Note: Needs rework into separate getCollarName and getCollarNameOnUser functions
 ************/
function getCollarName(serverID, userID, collarid) {
    traceFirstParam(arguments[0]);
    if (collarid) {
        return getBaseCollar(collarid)?.name
    } else {
        return getBaseCollar(getCollar(serverID, userID)?.collartype)?.name;
    }
}

exports.getCollarName = getCollarName;