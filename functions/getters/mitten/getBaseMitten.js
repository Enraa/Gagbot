/********* 
 * Gets the base mittens type by ID.
 * 
 *  - (string) type - the type of mittens to retrieve
 * ---
 * ##### Returns the base mittens definition. All mittens definitions have:
 * - name: The user facing display name of the mittens
 * - value: The type ID of the mittens 
 * - tags?: An array of strings with tags relating to those mittens. Optional.
 **********/
function getBaseMitten(type) {
    return process.mittentypes[type];
}

exports.getBaseMitten = getBaseMitten;