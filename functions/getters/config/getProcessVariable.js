/*******
 * Get the base object for a user. 
 * 
 * - (server ID) serverID - The server this is for
 * - (user ID) userID - The user this is for
 * - (string) processvar - The specific variable to get
 * ---
 * ##### Returns the object if it exists, undefined if it doesn't. 
 *******/
function getProcessVariable(serverID, userID, processvar) {
    if (process[processvar] == undefined) { process[processvar] = {} }
    if (process[processvar][serverID] == undefined) { process[processvar][serverID] = {} }
    return process[processvar][serverID][userID]
}

exports.getProcessVariable = getProcessVariable;