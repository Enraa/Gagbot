const { mittentypes } = require("../../gagfunctions");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

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
    if (process.mitten == undefined) {
        process.mitten = {};
    }
    if (process.mitten[serverID] == undefined) {
        process.mitten[serverID] = {};
    }
    let convertmittenarr = {};
    for (let i = 0; i < mittentypes.length; i++) {
        convertmittenarr[mittentypes[i].value] = mittentypes[i].name;
    }
    if (mittenname) {
        return convertmittenarr[mittenname];
    } else if (process.mitte[serverID][userID]?.mittenname) {
        return convertmittenarr[process.mitten[serverID][userID]?.mittenname];
    } else {
        return undefined;
    }
}

exports.getMittenName = getMittenName;