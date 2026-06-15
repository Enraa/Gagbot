/********* 
 * Gets the base collar type by ID.
 * 
 *  - (string) type - the type of collar to retrieve
 * ---
 * ##### Returns the base collar definition. All collar definitions have:
 * - name: The user facing display name of the collar
 * - value: The type ID of the collar 
 * - tags?: An array of strings with tags relating to that collar. Optional.
 * - special?: If true, shows in list for /key additionalcollar. Optional.
 **********/
function getBaseCollar(type) {
    return process.collartypes.find((c) => c.value == type)
}

exports.getBaseCollar = getBaseCollar;