const { getCollar } = require("../../getters/collar/getCollar");

/*******
 * Removes an additional Collar effect from the user's collar, if they are wearing a collar. 
 * 
 * - (user id) user - The user wearing the collar.
 * - (string) type - The collar effect to remove
 * ---
 * ##### *No return value*
 *******/
function removeAdditionalCollarEffect(user, type) {
    try {
        if (getCollar(user)) {
            if (getCollar(user).additionalcollars && getCollar(user).additionalcollars.includes(type)) {
                getCollar(user).additionalcollars.splice(getCollar(user).additionalcollars.indexOf(type), 1);
            }
            if (getCollar(user).additionalcollars && getCollar(user).additionalcollars.length == 0) {
                delete getCollar(user).additionalcollars;
            }
            if (process.readytosave == undefined) {
                process.readytosave = {};
            }
            process.readytosave.collar = true;
        }
    }
    catch (err) {
        console.log(err)
    }
}

exports.removeAdditionalCollarEffect = removeAdditionalCollarEffect;