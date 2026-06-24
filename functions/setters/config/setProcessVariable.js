const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*******
 * Set a base object for a user. 
 * 
 * - (server ID) serverID - The server this is for
 * - (user ID) userID - The user this is for
 * - (string) processvar - The specific variable to save as
 * - (any) value - The value to set 
 * ---
 * ##### *No return value*
 *******/
function setProcessVariable(serverID, userID, processvar, value) {
    traceFirstParam(arguments[0]);
    if (process[processvar] == undefined) { process[processvar] = {} }
    if (process[processvar][serverID] == undefined) { process[processvar][serverID] = {} }
    process[processvar][serverID][userID] = value;
    markForSave(processvar);
}

exports.setProcessVariable = setProcessVariable;