/********* 
 * Gets the base gag type by ID.
 * 
 *  - (string) type - the type of gag to retrieve
 * ---
 * ##### Returns the base gag definition. All gag definitions have:
 * - choicename: The user facing display name of the gag
 * - tags?: An array of strings with tags relating to that gag. Optional.
 * - garbleText?: The main garbling function of the gag
 * - messagebegin?: The function to modify the gag before main garble, called once.
 * - messageend?: Called after main garble. Called once.
 * - breathrecovery?: The modifier to corset breath recovery rate. 
 **********/
function getBaseGag(type) {
    return process.gagtypes[type];
}

exports.getBaseGag = getBaseGag;