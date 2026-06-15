const { markForSave } = require("../../other/markForSave");

/********
 * Renames an outfit for a user
 * 
 * - (user id) userID - The user whose outfit is being renamed
 * - (integer) slot - The slot number to rename
 * - (string) newname - The name to change the slot to 
 * ---
 * ##### *No return value*
 ********/
function renameOutfit(userID, slot, newname) {
	if (process.outfits == undefined) {
		process.outfits = {};
	}
	if (process.outfits[userID] == undefined) {
		process.outfits[userID] = [];
	}
	if (process.outfits[userID][slot]) {
		process.outfits[userID][slot].outfitname = newname;
	}
	markForSave("outfits");
}

exports.renameOutfit = renameOutfit;