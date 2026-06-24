const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Adds or modifies mittens on the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the mittens
 * - (string) mittentype - The type of mittens applied to the wearer
 * - (user id) origbinder - Who's adding/modifying the mittens
 * ---
 * ##### *No return value*
 **********/
function assignMitten(serverID, userID, mittentype, origbinder) {
    traceFirstParam(arguments[0]);
	if (process.mitten == undefined) {
		process.mitten = {};
	}
    if (process.mitten[serverID] == undefined) {
		process.mitten[serverID] = {};
	}
	let originalbinder = process.mitten[serverID][userID]?.origbinder;
	process.mitten[serverID][userID] = {
		mittenname: mittentype,
		origbinder: originalbinder ?? origbinder, // Preserve original binder until it is removed.
	};

    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[serverID] == undefined) { process.userstats[serverID] = {} }
    if (process.userstats[serverID][userID] == undefined) { process.userstats[serverID][userID] = {} }

    process.userstats[serverID][userID].wornmittens = (process.userstats[serverID][userID].wornmittens ?? 0) + 1;
    
	markForSave("mitten");
    markForSave("userstats");
};

exports.assignMitten = assignMitten;