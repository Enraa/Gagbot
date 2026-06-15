/************
 * Gets the full gag name by ID
 * 
 * - (string) type - The gag ID to retrieve the gag name of
 * ---
 * ##### Returns a string with the user-facing display name of the gag.
 * ---
 * ###### Needs rework into getBaseGag
 ************/
function convertGagText(type) {
    return process.gagtypes[type]?.choicename;
};

exports.convertGagText = convertGagText;
exports.getGagName = convertGagText;