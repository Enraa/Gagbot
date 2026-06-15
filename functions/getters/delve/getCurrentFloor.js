/********
 * Gets the current floor the user is on. 
 * 
 * - (user ID) user - The user ID doing the delve
 * ---
 * ##### Returns undefined if they're not on a delve, 0 if at delve entrance, or an integer floor number
 ********/
function getCurrentFloor(user) {
    if (process.delveuserdata == undefined) { process.delveuserdata = {} }
    if (process.delveuserdata[user]) {
        // They started a delve, return the floor
        return process.delveuserdata[user].floor
    }
    else {
        // They're not in the Delve.
        return undefined;
    }
}

exports.getCurrentFloor = getCurrentFloor;