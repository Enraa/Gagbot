const { getChastityBra } = require("../../getters/chastity/getChastityBra");
const { markForSave } = require("../../other/markForSave");

/*******
 * Removes a cloned key from a chastity bra
 * 
 * - (user id) chastityuser - The user wearing the chastity bra
 * - (user id) newKeyholder - The user to remove from the cloned key list
 * ---
 * ##### *No return value*
 *******/
function revokeChastityBraKey(chastityuser, newKeyholder) {
    let chastity = getChastityBra(chastityuser);
    if (!chastity.clonedKeyholders) {
        chastity.clonedKeyholders = [];
    }
    if (chastity.clonedKeyholders.includes(newKeyholder)) {
        chastity.clonedKeyholders.splice(chastity.clonedKeyholders.indexOf(newKeyholder), 1);
    }
    markForSave("chastitybra");
};

exports.revokeChastityBraKey = revokeChastityBraKey;