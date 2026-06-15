const { getBaseHeavy } = require("./getBaseHeavy");

/*********
 * Get Heavy Bondage worn by the user. Returns arms -> legs -> container if multiple.
 * 
 * - (user id) user - The user wearing the heavy bondage
 * - (string) type? - If specified, get specific bondage 
 * ---
 * ##### Returns a heavy bondage object. All Heavy Bondage has:
 * - type: The item ID of the heavy bondage
 * - origbinder: The person who applied this heavy bondage
 * - displayname: The display name of this heavy bondage
 * - namedcontainerowner?: User ID included in container checks
 *********/
function getHeavy(user, type) {
    if (process.heavy == undefined) {
        process.heavy = {};
    }
    let returnarms;
    let returnlegs;
    let returncontainer;
    let returnedval;
    if (process.heavy[user] && (process.heavy[user].length > 0)) {
        if (!type) {
            let mapped = process.heavy[user].map((h) => getBaseHeavy(h.type))
        
            // return arms first
            mapped.forEach((h) => {
                if (h.heavytags.includes("arms")) {
                    returnarms = process.heavy[user].find((heavy) => heavy.type === h.value)
                }
            })
            // return legs next
            mapped.forEach((h) => {
                if (h.heavytags.includes("legs")) {
                    returnlegs = process.heavy[user].find((heavy) => heavy.type === h.value)
                }
            })
            // return container last
            mapped.forEach((h) => {
                if (h.heavytags.includes("container")) {
                    returncontainer = process.heavy[user].find((heavy) => heavy.type === h.value)
                }
            })
            if (returnarms) {
                returnedval = returnarms;
            }
            else if (returnlegs) {
                returnedval = returnlegs;
            }
            else if (returncontainer) {
                returnedval = returncontainer;
            }
        }
        else {
            returnedval = process.heavy[user].find((h) => h.type === type);
        }
    }
    return returnedval
}

exports.getHeavy = getHeavy;