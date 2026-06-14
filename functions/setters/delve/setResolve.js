/*******
 * Modifies the user's current Resolve, reducing it to 0 at minimum if it goes past that. 
 * 
 * - (user id) user - User ID doing the Delve
 * - (integer) resolveamt - Amount of resolve to add or remove
 *******/
function modifyResolve(user, resolveamt) {
    if (process.delveuserdata == undefined) { process.delveuserdata = {} }
    if (process.delveuserdata[user]) {
        process.delveuserdata[user].resolve = Math.max(parseInt(process.delveuserdata[user].resolve) + resolveamt, 0);
    }
}

exports.setResolve = modifyResolve;
exports.modifyResolve = modifyResolve;