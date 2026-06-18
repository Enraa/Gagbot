const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getUserVar } = require("../config/getUserVar");
const { getBaseHeavy } = require("./getBaseHeavy");
const { getHeavy } = require("./getHeavy");

/*******
 * Retrieve a list of restrictions for a user based on current heavy bondage
 * 
 * - (server id) serverID - The server this is running on 
 * - (user id) user - The person wearing the heavy bondage
 * ---
 * ##### Returns an object with the following properties:
 * - heavytags: Array of "arms", "legs", or "container" the user is wearing
 * - touchself: If true, the user is able to do actions on self
 * - touchothers: If true, the user is able to do actions on others
 * - touchlist?: If specified, an array of users the user can do actions to
 *******/
function getHeavyRestrictions(serverID, user) {
    traceFirstParam(arguments[0]);
    let returnobject = {
        heavytags: [],
        touchself: true,
        touchothers: true,
    }
    if (getHeavy(serverID, user) == undefined) {
        return returnobject; // User is unbound, they can do anything. 
    }
    else {
        process.heavy[serverID][user].forEach((heavy) => {
            if (getBaseHeavy(heavy.type).heavytags.includes("arms")) {
                if ((heavy.type == "windupclockwork") && (getUserVar(serverID, user, "windupcharge") <= 0.0005)) {
                    returnobject.heavytags.push("arms");
                    returnobject.touchself = false;
                    returnobject.touchothers = false;
                }
                else if (heavy.type != "windupclockwork") {
                    returnobject.heavytags.push("arms");
                    returnobject.touchself = false;
                    returnobject.touchothers = false;
                }
            }
            if (getBaseHeavy(heavy.type).heavytags.includes("legs")) {
                returnobject.heavytags.push("legs");
                returnobject.touchothers = false;
            }
            if (getBaseHeavy(heavy.type).heavytags.includes("container")) {
                returnobject.heavytags.push("container");
                if (!returnobject.touchlist) {
                    returnobject.touchlist = [];
                }
                // Users in a container can ONLY do stuff to OTHERS in that same container. 
                Object.keys(process.heavy[serverID]).forEach((k) => {
                    if (getHeavy(serverID, k, heavy.type)) {
                        returnobject.touchlist.push(k);
                    }
                }) 
                // Users in a named container can do things to the owner of that named container
                if (heavy.namedcontainerowner) { returnobject.touchlist.push(heavy.namedcontainerowner) }
            }
        })
        console.log(returnobject.touchlist);
        return returnobject;
    }
}

exports.getHeavyRestrictions = getHeavyRestrictions;