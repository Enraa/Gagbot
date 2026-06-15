const { getChastity } = require("../../getters/chastity/getChastity");

/********
 * Adds a user as a cloned keyholder for the chastity belt
 * 
 * - (user id) chastityuser - The user wearing the chastity belt
 * - (user id) newKeyholder - The user added to the chastity belt's cloned keys
 * ---
 * ##### *No return value*
 ********/
function cloneChastityKey(chastityuser, newKeyholder) {
    let chastity = getChastity(chastityuser);
    if (!chastity.clonedKeyholders) {
        chastity.clonedKeyholders = [];
    }
    chastity.clonedKeyholders.push(newKeyholder);
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.chastity = true;
};

exports.cloneChastityKey = cloneChastityKey;