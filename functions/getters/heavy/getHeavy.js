const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getBaseHeavy } = require("./getBaseHeavy");

/*********
 * Get Heavy Bondage worn by the user. Returns arms -> legs -> container if multiple.
 * 
 * - (server ID) serverID - The server this is running on
 * - (user id) user - The user wearing the heavy bondage
 * - (string) type? - If specified, get specific bondage 
 * - (boolean) includenonbinding? - If true, heavies without a heavytag (such as a chair) can be returned. 
 * ---
 * ##### Returns a heavy bondage object. All Heavy Bondage has:
 * - type: The item ID of the heavy bondage
 * - origbinder: The person who applied this heavy bondage
 * - displayname: The display name of this heavy bondage
 * - namedcontainerowner?: User ID included in container checks
 *********/
function getHeavy(serverID, user, type, includenonbinding) {
    traceFirstParam(arguments[0]);
    if (process.heavy == undefined) {
        process.heavy = {};
    }
    if (process.heavy[serverID] == undefined) {
        process.heavy[serverID] = {};
    }
    let returnarms;
    let returnlegs;
    let returncontainer;
    let nonbinding;
    let returnedval;
    if (process.heavy[serverID][user] && (process.heavy[serverID][user].length > 0)) {
        if (!type) {
            let mapped = process.heavy[serverID][user].map((h) => getBaseHeavy(h.type))
        
            // return arms first
            mapped.forEach((h) => {
                if (h.heavytags.includes("arms")) {
                    returnarms = process.heavy[serverID][user].find((heavy) => heavy.type === h.value)
                }
            })
            // return legs next
            mapped.forEach((h) => {
                if (h.heavytags.includes("legs")) {
                    returnlegs = process.heavy[serverID][user].find((heavy) => heavy.type === h.value)
                }
            })
            // return container last
            mapped.forEach((h) => {
                if (h.heavytags.includes("container")) {
                    returncontainer = process.heavy[serverID][user].find((heavy) => heavy.type === h.value)
                }
            })
            if (includenonbinding) {
                mapped.forEach((h) => {
                    if (!h.heavytags || (h.heavytags?.length == 0)) {
                        nonbinding = process.heavy[serverID][user].find((heavy) => heavy.type === h.value)
                    }
                })
            }
            if (returnarms) {
                returnedval = returnarms;
            }
            else if (returnlegs) {
                returnedval = returnlegs;
            }
            else if (returncontainer) {
                returnedval = returncontainer;
            }
            else if (nonbinding) {
                returnedval = nonbinding;
            }
        }
        else {
            returnedval = process.heavy[serverID][user].find((h) => h.type === type);
        }
    }
    return returnedval
}

exports.getHeavy = getHeavy;