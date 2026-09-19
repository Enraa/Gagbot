const { getProcessVariable } = require("../config/getProcessVariable");

/*********
 * Retrieves the full inventory of a user. 
 * 
 * - (server id) serverID - The server it is running on
 * - (user id) userID - The user to check
 * ---
 * ##### Returns an array of objects. All inventory objects will have the following properties:
 * - itemtype: (string) The item ID
 * - quantity: (integer)
 * - ... additional properties if necessary
 *********/
function getInventory(serverID, userID) {
    return (getProcessVariable(serverID, userID, "inventory") ?? []);
}

exports.getInventory = getInventory;