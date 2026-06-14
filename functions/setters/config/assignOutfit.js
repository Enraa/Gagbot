const { getChastity } = require("../../getters/chastity/getChastity");
const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { getCollar } = require("../../getters/collar/getCollar");
const { getCorset } = require("../../getters/corset/getCorset");
const { getGags } = require("../../getters/gag/getGags");
const { getHeavy } = require("../../getters/heavy/getHeavy");
const { getMitten } = require("../../getters/mitten/getMitten");
const { getToys } = require("../../getters/toy/getToys");
const { getLockedWearable } = require("../../getters/wearable/getLockedWearable");
const { getWearable } = require("../../getters/wearable/getWearable");

/*********
 * Assigns an outfit to a slot for a user
 * 
 * - (user id) userID - The user whose outfit is getting saved
 * - (integer) slot - The slot number to save into
 * - (string bitarray) options - The 8 digit bit array 
 * ---
 * ##### *No return value*
**********/
function assignOutfit(userID, slot, options) {
	if (process.outfits == undefined) {
		process.outfits = {};
	}
	if (process.outfits[userID] == undefined) {
		process.outfits[userID] = [];
	}
	let storedobject = {};
	if (typeof options == "string") {
		// These go in order based on inspect text.
		let optionbit = 0;
		if (options.charAt(optionbit) == 1) {
			storedobject.gag = getGags(userID).length > 0 ? getGags(userID) : undefined;
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.headwear = process.headwear[userID]; // Oops.
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.mitten = getMitten(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.wearable = getWearable(userID).length > 0 ? getWearable(userID) : undefined;
			storedobject.lockedwearable = getLockedWearable(userID).length > 0 ? getLockedWearable(userID) : undefined;
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.vibe = getToys(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.chastity = getChastity(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.chastitybra = getChastityBra(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.corset = getCorset(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.heavy = getHeavy(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.collar = getCollar(userID);
		}
		if (Object.keys(storedobject).length > 0) {
			process.outfits[userID][slot] = JSON.parse(JSON.stringify(storedobject));
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.outfits = true;
		}
	}
}

exports.assignOutfit = assignOutfit;