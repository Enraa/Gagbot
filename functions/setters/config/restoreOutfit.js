const { canAccessChastity } = require("../../getters/chastity/canAccessChastity");
const { canAccessChastityBra } = require("../../getters/chastity/canAccessChastityBra");
const { getChastity } = require("../../getters/chastity/getChastity");
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
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*********
 * Retrieves an outfit and attempts to apply it to the user. 
 * Application will follow the same constraints as applying the bondage pieces from their other standard commands.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user whose outfit to restore
 * - (object) storedobject - An object of restraint objects to restore to the user
 * ---
 * ##### *No return value*
 *********/
function restoreOutfit(serverID, userID, storedobject) {
    traceFirstParam(arguments[0]);
	Object.keys(storedobject).forEach((k) => {
		// I could use a switch statement here but I feel like using if conditionals.
		if (k == "wearable") {
			getWearable(serverID, userID);
			getLockedWearable(serverID, userID);
			if (!getHeavy(serverID, userID)) {
				process.wearable[serverID][userID] = { wornwearable: storedobject.wearable, locked: storedobject.lockedwearable };
				markForSave("wearable");
			}
		}
		if (k == "gag") {
			getGags(serverID, userID);
			if (!getHeavy(serverID, userID) && !getMitten(serverID, userID)) {
				process.gags[serverID][userID] = storedobject.gag;
				markForSave("gags");
			}
		}
		if (k == "mitten") {
			getMitten(serverID, userID);
			if (!getHeavy(serverID, userID) && !getMitten(serverID, userID)) {
				process.mitten[serverID][userID] = storedobject.mitten;
				markForSave("mitten");
			}
		}
		if (k == "headwear") {
			getHeadwear(serverID, userID);
			if (!getHeavy(serverID, userID) && !getMitten(serverID, userID)) {
				process.headwear[serverID][userID] = storedobject.headwear;
				markForSave("headwear");
			}
		}
		if (k == "collar") {
			getCollar(serverID, userID);
			if (!getHeavy(serverID, userID) && (canAccessCollar(serverID, userID, userID, true).access || !canAccessCollar(serverID, userID, userID, true).hascollar)) {
				process.collar[serverID][userID] = storedobject.collar;
				markForSave("collar");
			}
		}
		if (k == "heavy") {
			getHeavy(serverID, userID);
			if (!getHeavy(serverID, userID)) {
                if (!Array.isArray(storedobject.heavy)) {
                    console.log("Loading a heavy that is not an array")
                    console.log(storedobject.heavy)
                    process.heavy[serverID][userID] = [storedobject.heavy];
                }
                else {
                    process.heavy[serverID][userID] = storedobject.heavy;
                }
				markForSave("heavy");
			}
		}
		if (k == "corset") {
			getCorset(serverID, userID);
			if (!getHeavy(serverID, userID) && (canAccessChastity(serverID, userID, userID, true).access || !canAccessChastity(serverID, userID, userID, true).hasbelt)) {
				process.corset[serverID][userID] = storedobject.corset;
				markForSave("corset");
			}
		}
		if (k == "chastity") {
			getChastity(serverID, userID);
			if (!getHeavy(serverID, userID) && (canAccessChastity(serverID, userID, userID, true).access || !canAccessChastity(serverID, userID, userID, true).hasbelt)) {
				process.chastity[serverID][userID] = storedobject.chastity;
                if (process.chastity[serverID][userID].stateligible) {
                    process.chastity[serverID][userID].stateligible = false;
                }
				markForSave("chastity");
			}
		}
		if (k == "chastitybra") {
			getChastityBra(serverID, userID);
			if (!getHeavy(serverID, userID) && (canAccessChastityBra(serverID, userID, userID, true).access || !canAccessChastityBra(serverID, userID, userID, true).hasbelt)) {
				process.chastitybra[serverID][userID] = storedobject.chastitybra;
                if (process.chastitybra[serverID][userID].stateligible) {
                    process.chastitybra[serverID][userID].stateligible = false;
                }
				markForSave("chastitybra");
			}
		}
	});
}

exports.restoreOutfit = restoreOutfit;