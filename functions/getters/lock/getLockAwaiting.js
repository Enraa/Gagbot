/*************
 * Retrieves an awaiting lock by UUID
 * 
 * - (string) uuid - The UUID of the awaiting lock to retrieve.
 * ---
 * ##### Returns the lock object that the UUID matches
 *************/
function getLockAwaiting(uuid) {
    if (process.awaitinglock) {
        return process.awaitinglock[uuid];
    }
}

exports.getLockAwaiting = getLockAwaiting;