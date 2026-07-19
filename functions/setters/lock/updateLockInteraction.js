/***********
 * Given an interaction and a UUID, updates the awaiting lock object with the new interaction, if it exists. 
 * 
 * - (interaction) interaction - The interaction token that the user is invoking this from
 * - (string) uuid - The UUID that the user is using
 * ---
 * ##### *No return value*
 ***********/
function updateLockInteraction(interaction, uuid) {
    if (process.awaitinglock == undefined) { process.awaitinglock = {} }
    if (process.awaitinglock[uuid]) {
        process.awaitinglock[uuid].interaction = interaction;
    }
}

exports.updateLockInteraction = updateLockInteraction;