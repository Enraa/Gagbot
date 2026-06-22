const { getProcessVariable } = require("./getProcessVariable");

/***********
 * Get a user's consents
 * 
 * - (server id) serverID - The server this is running on!
 * - (user id) user - The user we need to check consent for
 * ---
 * ##### Returns an object with the following properties:
 * - mainconsent: True if they clicked the Accept button
 ***********/
function getConsent(serverID, user) {
	if (user === process.client.user.id) {
		return { mainconsent: true }; // Lol, trying to gag us.
	}
    return getProcessVariable(serverID, user, "consented");
};

exports.getConsent = getConsent;