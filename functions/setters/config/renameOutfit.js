const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Renames an outfit for a user
 * 
 * - (server ID) serverID - The server this is running on
 * - (user id) userID - The user whose outfit is being renamed
 * - (integer) slot - The slot number to rename
 * - (string) newname - The name to change the slot to 
 * ---
 * ##### *No return value*
 ********/
function renameOutfit(serverID, userID, slot, newname) {
    traceFirstParam(arguments[0]);
	if (process.outfits == undefined) {
		process.outfits = {};
	}
    if (process.outfits[serverID] == undefined) {
		process.outfits[serverID] = {};
	}
	if (process.outfits[serverID][userID] == undefined) {
		process.outfits[serverID][userID] = [];
	}
	if (process.outfits[serverID][userID][slot]) {
		process.outfits[serverID][userID][slot].outfitname = newname;
	}
	markForSave("outfits");
}

exports.renameOutfit = renameOutfit;