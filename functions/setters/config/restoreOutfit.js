const { canAccessChastity } = require("../../getters/chastity/canAccessChastity");
const { canAccessChastityBra } = require("../../getters/chastity/canAccessChastityBra");
const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { canAccessCollar } = require("../../getters/collar/canAccessCollar");
const { getCollar } = require("../../getters/collar/getCollar");
const { getCorset } = require("../../getters/corset/getCorset");
const { getGags } = require("../../getters/gag/getGags");
const { getHeadwear } = require("../../getters/headwear/getHeadwear");
const { getHeavy } = require("../../getters/heavy/getHeavy");
const { getMitten } = require("../../getters/mitten/getMitten");
const { getLockedWearable } = require("../../getters/wearable/getLockedWearable");
const { getWearable } = require("../../getters/wearable/getWearable");

/*********
 * Retrieves an outfit and attempts to apply it to the user. 
 * Application will follow the same constraints as applying the bondage pieces from their other standard commands.
 * 
 * - (user id) userID - The user whose outfit to restore
 * - (object) storedobject - An object of restraint objects to restore to the user
 * ---
 * ##### *No return value*
 *********/
function restoreOutfit(userID, storedobject) {
	Object.keys(storedobject).forEach((k) => {
		// I could use a switch statement here but I feel like using if conditionals.
		if (k == "wearable") {
			getWearable(userID);
			getLockedWearable(userID);
			if (!getHeavy(userID)) {
				process.wearable[userID] = { wornwearable: storedobject.wearable, locked: storedobject.lockedwearable };
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.wearable = true;
			}
		}
		if (k == "gag") {
			getGags(userID);
			if (!getHeavy(userID) && !getMitten(userID)) {
				process.gags[userID] = storedobject.gag;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.gags = true;
			}
		}
		if (k == "mitten") {
			getMitten(userID);
			if (!getHeavy(userID) && !getMitten(userID)) {
				process.mitten[userID] = storedobject.mitten;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.mitten = true;
			}
		}
		if (k == "headwear") {
			getHeadwear(userID);
			if (!getHeavy(userID) && !getMitten(userID)) {
				process.headwear[userID] = storedobject.headwear;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.headwear = true;
			}
		}
		if (k == "collar") {
			getCollar(userID);
			if (!getHeavy(userID) && (canAccessCollar(userID, userID, true).access || !canAccessCollar(userID, userID, true).hascollar)) {
				process.collar[userID] = storedobject.collar;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.collar = true;
			}
		}
		if (k == "heavy") {
			getHeavy(userID);
			if (!getHeavy(userID)) {
                if (!Array.isArray(storedobject.heavy)) {
                    console.log("Loading a heavy that is not an array")
                    console.log(storedobject.heavy)
                    process.heavy[userID] = [storedobject.heavy];
                }
                else {
                    process.heavy[userID] = storedobject.heavy;
                }
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.heavy = true;
			}
		}
		if (k == "corset") {
			getCorset(userID);
			if (!getHeavy(userID) && (canAccessChastity(userID, userID, true).access || !canAccessChastity(userID, userID, true).hasbelt)) {
				process.corset[userID] = storedobject.corset;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.corset = true;
			}
		}
		if (k == "chastity") {
			getChastity(userID);
			if (!getHeavy(userID) && (canAccessChastity(userID, userID, true).access || !canAccessChastity(userID, userID, true).hasbelt)) {
				process.chastity[userID] = storedobject.chastity;
                if (process.chastity[userID].stateligible) {
                    process.chastity[userID].stateligible = false;
                }
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.chastity = true;
			}
		}
		if (k == "chastitybra") {
			getChastityBra(userID);
			if (!getHeavy(userID) && (canAccessChastityBra(userID, userID, true).access || !canAccessChastityBra(userID, userID, true).hasbelt)) {
				process.chastitybra[userID] = storedobject.chastitybra;
                if (process.chastitybra[userID].stateligible) {
                    process.chastitybra[userID].stateligible = false;
                }
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.chastitybra = true;
			}
		}
		/*if (k == "vibe") { // Disabling toys since now there are multiple different conditions that can apply. 
			getToys(userID);
			if (!getHeavy(userID) && (canAccessChastity(userID, userID, true).access || !canAccessChastity(userID, userID, true).hasbelt)) {
				process.vibe[userID] = storedobject.vibe;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.vibe = true;
			}
		}*/
	});
}

exports.restoreOutfit = restoreOutfit;