const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getBaseMitten } = require("./getBaseMitten");
const { getMitten } = require("./getMitten");

/************
 * Gets the full mitten name of the User ID. Optionally will get the full mitten name of mittens by ID.
 * 
 * - (server id) serverID - The server this is running on 
 * - (user id) user - The User ID to get the collar name of
 * - (string) mittenname - The collar ID to retrieve the collar name of
 * ##### *Note: This function should use either/or param, not both.*
 * ---
 * ##### Returns a string with the user-facing display name of the mittens.
 * ---
 * ###### Note: Needs rework into separate getMittenName and getMittenNameOnUser functions
 ************/
function getMittenName(serverID, userID, mittenname) {
    traceFirstParam(arguments[0]);
    if (mittenname) {
        return getBaseMitten(mittenname).name;
    } else if (getMitten(serverID, userID)?.mittenname) {
        return getBaseMitten(getMitten(serverID, userID)?.mittenname)?.name
    } else {
        return undefined;
    }
}

exports.getMittenName = getMittenName;