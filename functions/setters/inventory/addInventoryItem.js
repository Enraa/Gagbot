const { getInventory } = require("../../getters/inventory/getInventory");
const { markForSave } = require("../../other/markForSave");

/********
 * Adds an item to a user's inventory, creating it or incrementing the quantity.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is for
 * - (string) item - The item ID to add
 * - (integer) quantity? - The number to add. If undefined, defaults to 1. 
 * ---
 * ##### *No return value*
 ********/
function addInventoryItem(serverID, userID, item, quantity = 1) {
    let inventory = getInventory(serverID, userID);
    if (inventory.find((f) => f.itemtype === item)) {
        inventory.find((f) => f.itemtype === item).quantity = (inventory.find((f) => f.itemtype === item).quantity + quantity);
    }
    else {
        inventory.push({
            itemtype: item,
            quantity: quantity
        })
    }
    markForSave("inventory");
}

exports.addInventoryItem = addInventoryItem;