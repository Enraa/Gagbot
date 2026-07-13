const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Check if a toy by ID can be removed from the target by the user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person who is wearing the toy
 * - (user id) keyholderID - The person who is removing the toy
 * - (string) toy - The specific kind of toy to remove
 * ---
 * ##### Returns true if the toy is permitted to be placed
 ********/
function canRemoveToy(serverID, userID, keyholderID, toy) {
    traceFirstParam(arguments[0]);
    return (process.toytypes && process.toytypes[toy] && process.toytypes[toy].canUnequip({ serverID: serverID, userID: userID, keyholderID: keyholderID }))
}

exports.canRemoveToy = canRemoveToy;