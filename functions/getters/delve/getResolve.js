/*******
 * Gets the user's current Resolve
 * 
 * - (user id) user - User ID doing the Delve
 * ---
 * ##### Returns an integer with the current resolve of the user
 *******/
function getResolve(user) {
    if (process.delveuserdata == undefined) { process.delveuserdata = {} }
    if (process.delveuserdata[user]) {
        // They started a delve, return their current resolve
        return process.delveuserdata[user].resolve
    }
    else {
        // They're not in the Delve.
        return undefined;
    }
}

exports.getResolve = getResolve;