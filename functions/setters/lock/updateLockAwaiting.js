/**********
 * Given a UUID, updates a property on that awaiting lock if it exists
 * 
 * - (string) uuid - The awaiting lock we want to modify
 * - (string) param - The specific param we want to modify or remove
 * - (any) value - The specific value we want to set it to
 * ---
 * ##### *No return value*
 **********/
function updateLockAwaiting(uuid, param, value) {
    if (process.awaitinglock && process.awaitinglock[uuid]) {
        process.awaitinglock[uuid][param] = value;
    }
}

exports.updateLockAwaiting = updateLockAwaiting;