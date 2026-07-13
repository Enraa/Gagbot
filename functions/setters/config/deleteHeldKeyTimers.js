/***********
 * Removes a, or all held key timers for a user's restraint.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is for
 * - (string) restraint? - If specified, removes a specific restraint. Otherwise, removes all of them
 * ---
 * ##### *No return value*
 ***********/
function deleteHeldKeyTimers(serverID, userID, restraint) {
    if (restraint && process.heldkeytimers) {
        delete process.heldkeytimers[`${serverID}_${userID}_${restraint}`]
    }
    else {
        delete process.heldkeytimers[`${serverID}_${userID}_collar`]
        delete process.heldkeytimers[`${serverID}_${userID}_chastity`]
        delete process.heldkeytimers[`${serverID}_${userID}_chastitybra`]
    }
}

exports.deleteHeldKeyTimers = deleteHeldKeyTimers;