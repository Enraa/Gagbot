const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*******
 * Set a floor prop on the floordata array. This is data only used by the floor itself. 
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) user - The user ID doing the delve
 * - (integer) floor - Floor number they are on
 * - (string) prop - Name of the property to save
 * - (any) value - Value to store in the prop key
 * ---
 * ##### *No return value*
 *******/
function setDelveFloorState(serverID, user, floor, prop, value) {
    traceFirstParam(arguments[0]);
    if (process.delveuserdata == undefined) { process.delveuserdata = {} }
    if (process.delveuserdata[serverID] == undefined) { process.delveuserdata[serverID] = {} }
    if (process.delveuserdata[serverID][user]) {
        // They started a delve, now check what floor they're on
        if (process.delveuserdata[serverID][user].floordata == undefined) { process.delveuserdata[serverID][user].floordata = [] }
        if (process.delveuserdata[serverID][user].floordata[floor] == undefined) { process.delveuserdata[serverID][user].floordata[floor] = {} }
        process.delveuserdata[serverID][user].floordata[floor][prop] = value;
        markForSave("delveuserdata");
    }
}

exports.setDelveFloorState = setDelveFloorState;