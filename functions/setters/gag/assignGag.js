const { markForSave } = require("../../other/markForSave");

/**********
 * Adds or modifies a gag on the user.
 * 
 * - (user id) userID - The person wearing the gag
 * - (string) gagtype - The type of gag applied to the wearer
 * - (integer) intensity - How tight the gag is applied to the wearer
 * - (user id) origbinder - Who's adding/modifying the gag
 * ---
 * ##### *No return value*
 **********/
function assignGag(userID, gagtype = "ball", intensity = 5, origbinder) {
	if (process.gags == undefined) {
		process.gags = {};
	}
	if (process.gags[userID] == undefined) {
		process.gags[userID] = [];
	}
	// Retrieve the index if it is already on the wearer.
	let foundgag = process.gags[userID].findIndex((s) => s.gagtype == gagtype);
	let originalbinder = origbinder;
	if (foundgag > -1) {
		originalbinder = process.gags[userID][foundgag].origbinder;
		process.gags[userID].splice(foundgag, 1);
	}
	process.gags[userID].push({ gagtype: gagtype, intensity: intensity, origbinder: originalbinder });

    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[userID] == undefined) { process.userstats[userID] = {} }

    process.userstats[userID].worngags = (process.userstats[userID].worngags ?? 0) + 1;
    
    markForSave("gags");
    markForSave("userstats");
};

exports.assignGag = assignGag;