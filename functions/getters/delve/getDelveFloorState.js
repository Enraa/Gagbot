/*******
 * Get a floor's props. 
 * 
 * - (user ID) user - The user ID doing the delve
 * - (integer) floor - Floor number they are on
 * - (string) prop - Name of the property to save
 * - (any) value - Value to store in the prop key
 * ---
 * ##### Returns the current floordata for the floor
 *******/
function getDelveFloorState(user, floor) {
    if (process.delveuserdata == undefined) { process.delveuserdata = {} }
    if (process.delveuserdata[user]) {
        // They started a delve, now check what floor they're on
        if (process.delveuserdata[user].floordata == undefined) { process.delveuserdata[user].floordata = [] }
        if (process.delveuserdata[user].floordata[floor] == undefined) { process.delveuserdata[user].floordata[floor] = {} }
        return process.delveuserdata[user].floordata[floor]
    }
    else {
        return undefined;
    }
}

exports.getDelveFloorState = getDelveFloorState;