const { wearabletypes } = require("../../wearablefunctions");

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
function getBaseWearable(type) {
    try {
        let returnval = wearabletypes.find((w) => w.value == type)
        if (!returnval) {
            let colortosearch = type.split("_").slice(0,-1).join("_"); // remove the last element which should only be the color
            returnval = wearabletypes.find((w) => w.value == colortosearch)
        }
        return returnval;
    }
    catch (err) {
        console.log(err);
    }
}

exports.getBaseWearable = getBaseWearable;