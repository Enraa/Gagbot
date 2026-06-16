// This is a test function that should be removed once all the code has been tested. Eventually. 
// This will test the first param given to a function scope and throw if it is NOT a server ID. 
// This is attached to all getter and setter functions. The first line in the function execution should be:
//
// traceFirstParam(arguments[0]);

/*******
 * Test first param to see if it is on process.serversjoined. If it is not, do a client.guilds.fetch() on it. If that fails, throw. 
 * 
 * - (any) serverID - Hopefully a server ID
 * ---
 * ##### Returns true if it is a server ID, crashes if it's not. 
 *******/
function traceFirstParam(serverID) {
    if (!process.client.guilds.cache.get(serverID)) {
        console.error(`Invalid server ID ${serverID}!`)
        throw new Error(err)
    }
}

exports.traceFirstParam = traceFirstParam;