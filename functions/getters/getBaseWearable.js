/********* 
 * Gets the base wearable type by ID.
 * 
 *  - (string) type - the type of wearable to retrieve
 * ---
 * ##### Returns the base wearable definition. All wearable definitions have:
 * - name: The user facing display name of the wearable
 * - value: The type ID of the wearable 
 * - category: The category of the wearable
 * - tags?: An array of strings with tags relating to that wearable. Optional.
 * - colorable?: If true, the item has color variants
 * - forbiddenColors?: Colors not represented in variants
 * - uniqueColors?: Additional color variants
 **********/
function getBaseCollar(type) {
    return process.collartypes.find((c) => c.value == type)
}

exports.getBaseCollar = getBaseCollar;