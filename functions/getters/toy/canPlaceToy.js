const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/********
 * Check if a toy by ID can be placed on the target by the user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person to receive the toy
 * - (user id) keyholderID - The person put the toy on the user
 * - (string) toy - The specific kind of toy to place
 * ---
 * ##### Returns true if the toy is permitted to be placed
 ********/
function canPlaceToy(serverID, userID, keyholderID, toy) {
    traceFirstParam(arguments[0]);
    return (process.toytypes && process.toytypes[toy] && process.toytypes[toy].canEquip({ serverID: serverID, userID: userID, keyholderID: keyholderID }))
}

exports.canPlaceToy = canPlaceToy;