const { getBaseHeavy } = require("./getBaseHeavy");
const { getHeavyBound } = require("./getHeavyBound");

/*************
 * Checks if the heavy bondage can be removed or not. 
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The person wearing the heavy bondage
 * - (user ID) keyholderID - The person attempting to remove the heavy bondage
 * - (string) type - The specific bondage attempting to remove
 * ---
 * ##### Returns true/false if the heavy bondage can be removed or not. 
 *************/
function canRemoveHeavy(serverID, userID, keyholderID, type) {
    let heavybase = getBaseHeavy(type);
    if (heavybase?.canRemove) {
        return heavybase.canRemove({ serverID: serverID, userID: userID, keyholderID: keyholderID })
    }
    else {
        return getHeavyBound(serverID, keyholderID, userID);
    }
}

exports.canRemoveHeavy = canRemoveHeavy;