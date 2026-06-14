const { getChastity } = require("../../getters/chastity/getChastity");

/*******
 * Removes a cloned key from a chastity belt
 * 
 * - (user id) chastityuser - The user wearing the chastity belt
 * - (user id) newKeyholder - The user to remove from the cloned key list
 * ---
 * ##### *No return value*
 *******/
function revokeChastityKey(chastityuser, newKeyholder) {
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

exports.revokeChastityKey = revokeChastityKey;