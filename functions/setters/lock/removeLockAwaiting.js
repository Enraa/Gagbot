/**********
 * Given a UUID, clears the awaiting lock for it. 
 * 
 * - (string) uuid - The awaiting lock we want to clear
 * ---
 * ##### *No return value*
 **********/
function removeLockAwaiting(uuid) {
    if (process.awaitinglock) {
        delete process.awaitinglock[uuid];
    }
}

exports.removeLockAwaiting = removeLockAwaiting;