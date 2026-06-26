const { getHeavyList } = require("./getHeavyList");

/***********
 * Check if the target user is in any Dress Protocol type restraint. 
 * 
 * - (server id) serverID - The server this is running in
 * - (user id) userID - The user to check for
 * ---
 * ##### Returns the dress protocol restraint if there is any heavy restraint on the user that has the .dressprotocol tag, or false if not. 
 ***********/
function isInDressProtocol(serverID, userID) {
    return getHeavyList(serverID, userID).find((h) => h.dressprotocol);
}