const { getCollar } = require("../../getters/collar/getCollar");

/******
 * Adds an additional Collar effect to the user's collar, if they are wearing a collar. 
 * 
 * - (user id) user - The user wearing the collar.
 * - (string) type - The collar effect to add
 * ---
 * ##### *No return value*
 *******/
function addAdditionalCollarEffect(user, type) {
    try {
        if (getCollar(user)) {
            if (!getCollar(user).additionalcollars) { getCollar(user).additionalcollars = [] }
            getCollar(user).additionalcollars.push(type)
            if (process.readytosave == undefined) {
                process.readytosave = {};
            }
            process.readytosave.collar = true;
        }
    }
    catch (err) {
        console.log(err);
    }
}

exports.addAdditionalCollarEffect = addAdditionalCollarEffect;