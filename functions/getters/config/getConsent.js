/***********
 * Get a user's consents
 * 
 * - (user id) user - The user we need to check consent for
 * ---
 * ##### Returns an object with the following properties:
 * - mainconsent: True if they clicked the Accept button
 ***********/
function getConsent(user) {
	if (process.consented == undefined) {
		process.consented = {};
	}
	if (user === process.client.user.id) {
		return { mainconsent: true }; // Lol, trying to gag us.
	}
	return process.consented[user];
};

exports.getConsent = getConsent;