const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Check if a toy by ID can be removed from the target by the user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person removing the toy
 * - (user id) placerID - The person who has the toy
 * - (string) toy - The specific kind of toy to remove
 * ---
 * ##### Returns true if the toy is permitted to be placed
 ********/
function canRemoveToy(serverID, userID, placerID, toy) {
    traceFirstParam(arguments[0]);
    return (process.toytypes && process.toytypes[toy] && process.toytypes[toy].canUnequip({ serverID: serverID, userID: userID, placerID: placerID }))
}

exports.canRemoveToy = canRemoveToy;