/********* 
 * Gets the base headwear type by ID.
 * 
 *  - (string) type - the type of headwear to retrieve
 * ---
 * ##### Returns the base headwear definition. All headwear definitions have:
 * - name: The user facing display name of the headwear
 * - type: The type ID of the headwear 
 * - tags?: An array of strings with tags relating to that headwear. Optional.
 * - hidden?: If true, will not show in autocompletes
 * - lockable?: If true, will only be removable by origbinder and show as locked in /inspect
 * - blockinspect: If true, will anonymize info in /inspect
 * - blockemote: If true, will suppress emotes from user
 * - forcedtextemoji: If true, will typecast many emoji to plain text variants
 * - replaceemote: String to replace all emoji with
 * ---
 * **Functions**
 * - setupfunction: (data) => Called when setting up autocompletes and definitions
 * ---
 * **Events**
 * - onUnlock: (data) => Called when the headgear is removed
 **********/
function getBaseHeadwear(type) {
    return process.headtypes[type];
}

exports.getBaseHeadwear = getBaseHeadwear;
// getHeadwearBlocks expects this exact return, so we'll just make another export from it
// I should optimize that in the future. 
exports.getHeadwearBlocks = getBaseHeadwear; 