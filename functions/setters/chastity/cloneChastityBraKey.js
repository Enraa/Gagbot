const { getChastityBra } = require("../../getters/chastity/getChastityBra");

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
    console.log("CLONED");
    console.log(chastity);
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.chastitybra = true;
};

exports.cloneChastityBraKey = cloneChastityBraKey;