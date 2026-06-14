/*******
 * Removes a cloned key from a collar
 * 
 * - (user id) collarUser - The user wearing the collar
 * - (user id) newKeyholder - The user to remove from the cloned key list
 * ---
 * ##### *No return value*
 *******/
function revokeCollarKey(collarUser, newKeyholder) {
    let chastity = getChastity(chastityuser);
    if (!chastity.clonedKeyholders) {
        chastity.clonedKeyholders = [];
    }
    if (chastity.clonedKeyholders.includes(newKeyholder)) {
        chastity.clonedKeyholders.splice(chastity.clonedKeyholders.indexOf(newKeyholder), 1);
    }
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.chastity = true;
};

exports.revokeCollarKey = revokeCollarKey;