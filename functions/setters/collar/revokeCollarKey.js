const { getCollar } = require("../../getters/collar/getCollar");

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
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.collar = true;
};

exports.revokeCollarKey = revokeCollarKey;