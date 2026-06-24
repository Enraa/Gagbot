const { getChastity } = require("../../getters/chastity/getChastity");
const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { getCollar } = require("../../getters/collar/getCollar");
const { getCorset } = require("../../getters/corset/getCorset");
const { getGags } = require("../../getters/gag/getGags");
const { getHeavy } = require("../../getters/heavy/getHeavy");
const { getMitten } = require("../../getters/mitten/getMitten");
const { getToys } = require("../../getters/toy/getToys");
const { getLockedWearable } = require("../../getters/wearable/getLockedWearable");
const { getHeadwear } = require("../../getters/headwear/getHeadwear");
const { getWearable } = require("../../getters/wearable/getWearable");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*********
 * Assigns an outfit to a slot for a user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user whose outfit is getting saved
 * - (integer) slot - The slot number to save into
 * - (string bitarray) options - The 8 digit bit array 
 * ---
 * ##### *No return value*
**********/
function assignOutfit(serverID, userID, slot, options) {
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
	let storedobject = {};
	if (typeof options == "string") {
		// These go in order based on inspect text.
		let optionbit = 0;
		if (options.charAt(optionbit) == 1) {
			storedobject.gag = getGags(serverID, userID).length > 0 ? getGags(serverID, userID) : undefined;
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.headwear = getHeadwear(serverID, userID)
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.mitten = getMitten(serverID, userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.wearable = getWearable(serverID, userID).length > 0 ? getWearable(serverID, userID) : undefined;
			storedobject.lockedwearable = getLockedWearable(serverID, userID).length > 0 ? getLockedWearable(serverID, userID) : undefined;
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.vibe = getToys(serverID, userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.chastity = getChastity(serverID, userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.chastitybra = getChastityBra(serverID, userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.corset = getCorset(serverID, userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.heavy = getHeavy(serverID, userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.collar = getCollar(serverID, userID);
		}
		if (Object.keys(storedobject).length > 0) {
			process.outfits[serverID][userID][slot] = JSON.parse(JSON.stringify(storedobject));
			markForSave("outfits");
		}
	}
}

exports.assignOutfit = assignOutfit;