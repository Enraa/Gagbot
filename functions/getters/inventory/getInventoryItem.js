const { getInventory } = require("./getInventory");

/*******  
 * Gets a specific item the user has in their inventory, or undefined if it does not exist. 
 * 
 * - (server id) serverID - The server it is running on
 * - (user id) userID - The user to check
 * - (string) item - The item to retrieve
 * ---
 * ##### Returns a singular object with the following properties, if it exists:
 * - itemtype: (string) The item ID
 * - quantity: (integer)
 * - ... additional properties if necessary
 *********/
function getInventoryItem(serverID, userID, item) {
    return getInventory(serverID, userID).find((f) => f.itemtype === item)
}

exports.getInventoryItem = getInventoryItem;