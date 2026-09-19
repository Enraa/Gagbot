const { getInventory } = require("../../getters/inventory/getInventory");
const { markForSave } = require("../../other/markForSave");
const { setProcessVariable } = require("../config/setProcessVariable");

/********
 * Completely clears a user's inventory.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is for
 * ---
 * ##### *No return value*
 ********/
function removeInventoryItem(serverID, userID) {
    setProcessVariable(serverID, userID, "inventory", [])
    markForSave("inventory");
}

exports.removeInventoryItem = removeInventoryItem;