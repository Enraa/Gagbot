const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*******
 * Get a floor's props. 
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) user - The user ID doing the delve
 * - (integer) floor - Floor number they are on
 * - (string) prop - Name of the property to save
 * - (any) value - Value to store in the prop key
 * ---
 * ##### Returns the current floordata for the floor
 *******/
function getDelveFloorState(serverID, user, floor) {
    traceFirstParam(arguments[0]);
    if (process.delveuserdata == undefined) { process.delveuserdata = {} }
    if (process.delveuserdata[serverID] == undefined) { process.delveuserdata[serverID] = {} }
    if (process.delveuserdata[serverID] && process.delveuserdata[serverID][user]) {
        // They started a delve, now check what floor they're on
        if (process.delveuserdata[serverID][user].floordata == undefined) { process.delveuserdata[serverID][user].floordata = [] }
        if (process.delveuserdata[serverID][user].floordata[floor] == undefined) { process.delveuserdata[serverID][user].floordata[floor] = {} }
        return process.delveuserdata[serverID][user].floordata[floor]
    }
    else {
        return undefined;
    }
}

exports.getDelveFloorState = getDelveFloorState;