const crypto = require("crypto");
const { getBaseLock } = require("../../getters/lock/getBaseLock");

/*********
 * Creates a new entry in awaitinglock and assigns it a UUID. 
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The person receiving the lock
 * - (user ID) keyholderID - The person attempting to add the lock
 * - (string) locktype - The type of lock we're trying to add
 * - (object) restraintobject - The specific restraint we're trying to add it to. 
 * ---
 * ##### Returns a string representing the UUID of the new lock we're trying to add. 
 *********/
function createLockAwaiting(serverID, userID, keyholderID, locktype, restraintobject) {
    let lockobject = {
        serverID: serverID,
        userID: userID,
        keyholderID: keyholderID,
        locktype: locktype,
        restraintobject: restraintobject
    }
    let uuid = crypto.randomUUID()

    if (process.awaitinglock == undefined) { process.awaitinglock = {}}
    process.awaitinglock[uuid] = lockobject;

    getBaseLock(locktype).initializeLock({ uuid: uuid });

    return uuid;
}

exports.createLockAwaiting = createLockAwaiting;