const { getCollar } = require("../../getters/collar/getCollar");
const { markForSave } = require("../../other/markForSave");

/*******
 * Removes a cloned key from a collar
 * 
 * - (user id) collarUser - The user wearing the collar
 * - (user id) newKeyholder - The user to remove from the cloned key list
 * ---
 * ##### *No return value*
 *******/
function revokeCollarKey(collarUser, newKeyholder) {
    let collar = getCollar(collarUser);
    if (!collar.clonedKeyholders) {
        collar.clonedKeyholders = [];
    }
    if (collar.clonedKeyholders.includes(newKeyholder)) {
        collar.clonedKeyholders.splice(collar.clonedKeyholders.indexOf(newKeyholder), 1);
    }
    markForSave("collar");
};

exports.revokeCollarKey = revokeCollarKey;