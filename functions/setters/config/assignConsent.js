/*********
 * Assigns a main consent type to the user
 * ### This should ONLY be called ***after*** accepting it when prompted!!!
 * 
 * - (user id) user - The person accepting consent
 * ---
 * ##### *No return value*
 *********/
function assignConsent (user) {
	if (process.consented == undefined) {
		process.consented = {};
	}
	process.consented[user] = { mainconsent: true };
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.consented = true;
};

exports.assignConsent = assignConsent;