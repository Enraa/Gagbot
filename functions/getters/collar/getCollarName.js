/************
 * Gets the full collar name of the User ID. Optionally will get the full collar name of a collar by ID.
 * 
 * - (user id) user - The User ID to get the collar name of
 * - (string) collarid - The collar ID to retrieve the collar name of
 * ##### *Note: This function should use either/or param, not both.*
 * ---
 * ##### Returns a string with the user-facing display name of the collar.
 * ---
 * ###### Note: Needs rework into separate getCollarName and getCollarNameOnUser functions
 ************/
function getCollarName(userID, collarid) {
    if (process.collar == undefined) {
        process.collar = {};
    }
    let convertcollararr = {};
    for (let i = 0; i < process.collartypes.length; i++) {
        convertcollararr[process.collartypes[i].value] = process.collartypes[i].name;
    }
    if (collarid) {
        return convertcollararr[collarid];
    } else if (process.collar[userID]?.collartype) {
        return convertcollararr[process.collar[userID]?.collartype];
    } else {
        return undefined;
    }
}

exports.getCollarName = getCollarName;