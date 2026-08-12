const { getHeavyBound } = require("../heavy/getHeavyBound");
const { getBaseLock } = require("./getBaseLock");
const { getRestraintByUUID } = require("./getRestraintByUUID");

/**********
 * Can the user remove this kind of lock on the target. This is used for initial checks, not the permission check before removing it. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person who is locked
 * - (user id) keyholderID - The person removing the lock
 * - (string) uuid - The uuid of lock we're trying to remove
 * ---
 * ##### Returns true if allowed to remove the lock. 
 **********/
function canRemoveLock(serverID, userID, keyholderID, uuid) {
    let restraintlock = getRestraintByUUID(uuid)?.restraint?.lock;
    if (!restraintlock) { 
        console.log(`Invalid restraint uuid attempted in canRemoveLock: ${uuid}`)
        return false 
    } 
    let lock = getBaseLock(restraintlock.locktype)
    if (!lock) { 
        console.log(`Invalid lock type attempted in canRemoveLock: ${restraintlock.locktype}`)
        return false 
    } 
    // If the user is us OR we are not heavy bound...
    if ((getHeavyBound(serverID, keyholderID, userID)) || (userID == keyholderID)) {
        return lock.canUnlock({ serverID: serverID, userID: keyholderID, uuid: uuid })
    }
}

exports.canRemoveLock = canRemoveLock;