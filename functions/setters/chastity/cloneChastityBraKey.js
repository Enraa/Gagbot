const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { markForSave } = require("../../other/markForSave");

/********
 * Adds a user as a cloned keyholder for the chastity bra
 * 
 * - (user id) chastityuser - The user wearing the chastity bra
 * - (user id) newKeyholder - The user added to the chastity bra's cloned keys
 * ---
 * ##### *No return value*
 ********/
function cloneChastityBraKey(chastityuser, newKeyholder) {
    let chastity = getChastityBra(chastityuser);
    if (!chastity.clonedKeyholders) {
        chastity.clonedKeyholders = [];
    }
    chastity.clonedKeyholders.push(newKeyholder);
    markForSave("chastitybra");
};

exports.cloneChastityBraKey = cloneChastityBraKey;