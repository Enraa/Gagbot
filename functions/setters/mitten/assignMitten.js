/**********
 * Adds or modifies mittens on the user.
 * 
 * - (user id) userID - The person wearing the mittens
 * - (string) mittentype - The type of mittens applied to the wearer
 * - (user id) origbinder - Who's adding/modifying the mittens
 * ---
 * ##### *No return value*
 **********/
function assignMitten(userID, mittentype, origbinder) {
	if (process.mitten == undefined) {
		process.mitten = {};
	}
	let originalbinder = process.mitten[userID]?.origbinder;
	process.mitten[userID] = {
		mittenname: mittentype,
		origbinder: originalbinder ?? origbinder, // Preserve original binder until it is removed.
	};

    if (process.userstats == undefined) { process.userstats = {} }
    if (process.userstats[userID] == undefined) { process.userstats[userID] = {} }

    process.userstats[userID].wornmittens = (process.userstats[userID].wornmittens ?? 0) + 1;
    
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.mitten = true;
    process.readytosave.userdata = true;
};

exports.assignMitten = assignMitten;