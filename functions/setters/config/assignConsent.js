const { markForSave } = require("../../other/markForSave");

/*********
 * Assigns a main consent type to the user
 * ### This should ONLY be called ***after*** accepting it when prompted!!!
 * 
 * - (server id) serverID - The server this is running on. 
 * - (user id) user - The person accepting consent
 * ---
 * ##### *No return value*
 *********/
function assignConsent (serverID, user) {
	if (process.consented == undefined) {
		process.consented = {};
	}
    if (process.consented[serverID] == undefined) {
		process.consented[serverID] = {};
	}
	process.consented[serverID][user] = { mainconsent: true };
	markForSave("consented");
};

exports.assignConsent = assignConsent;