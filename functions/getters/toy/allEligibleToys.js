const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { canPlaceToy } = require("./canPlaceToy");
const { canRemoveToy } = require("./canRemoveToy");
const { getSpecificToy } = require("./getSpecificToy");
const { getToys } = require("./getToys");

/*********
 * Given a person and a keyholder, provides a string list of all toys the keyholder has access to add to the person. Does not include existing toys. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person who will receive the toys
 * - (user id) keyholderID - The person who is giving the toys
 * - (boolean) remove? - If true, returns toys that the keyholder can remove
 * ---
 * ##### Returns an array of strings containing the items that the keyholder can add or remove
 *********/
function allEligibleToys(serverID, userID, keyholderID, remove = false) {
    traceFirstParam(arguments[0]);
    let eligibletoys = [];
    if (!remove) {
        Object.keys(process.toytypes).forEach((tt) => {
            if (!getSpecificToy(serverID, userID, tt)) {
                if (canPlaceToy(serverID, userID, keyholderID, tt)) {
                    eligibletoys.push(tt);
                }
            }
        })
    }
    else {
        getToys(serverID, userID).forEach((tt) => {
            if (canRemoveToy(serverID, userID, keyholderID, tt.type)) {
                eligibletoys.push(tt.type);
            }
        })
    }
    return eligibletoys;
}

exports.allEligibleToys = allEligibleToys;