const { getChastity } = require("../../getters/chastity/getChastity");
const { markForSave } = require("../../other/markForSave");

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
    markForSave("chastity");
};

exports.cloneChastityKey = cloneChastityKey;