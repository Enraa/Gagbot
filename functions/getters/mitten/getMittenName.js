const { mittentypes } = require("../../gagfunctions");

/************
 * Gets the full mitten name of the User ID. Optionally will get the full mitten name of mittens by ID.
 * 
 * - (user id) user - The User ID to get the collar name of
 * - (string) mittenname - The collar ID to retrieve the collar name of
 * ##### *Note: This function should use either/or param, not both.*
 * ---
 * ##### Returns a string with the user-facing display name of the mittens.
 * ---
 * ###### Note: Needs rework into separate getMittenName and getMittenNameOnUser functions
 ************/
function getMittenName(userID, mittenname) {
    if (process.mitten == undefined) {
        process.mitten = {};
    }
    let convertmittenarr = {};
    for (let i = 0; i < mittentypes.length; i++) {
        convertmittenarr[mittentypes[i].value] = mittentypes[i].name;
    }
    if (mittenname) {
        return convertmittenarr[mittenname];
    } else if (process.mitten[userID]?.mittenname) {
        return convertmittenarr[process.mitten[userID]?.mittenname];
    } else {
        return undefined;
    }
}

exports.getMittenName = getMittenName;