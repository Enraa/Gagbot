const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getGag } = require("./getGag");

/********
 * Gets the intensity of the first worn gag. This function isn't used at all and should be removed.
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The user ID to retrieve the first gag for
 * ---
 * ##### Returns the intensity of the first gag
 ********/
function getGagIntensity(serverID, userID) {
    traceFirstParam(arguments[0]);
    return getGag(serverID, userID)?.intensity;
}

exports.getGagIntensity = getGagIntensity;