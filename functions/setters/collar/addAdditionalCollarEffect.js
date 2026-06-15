const { getCollar } = require("../../getters/collar/getCollar");
const { markForSave } = require("../../other/markForSave");

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
            markForSave("collar");
        }
    }
    catch (err) {
        console.log(err);
    }
}

exports.addAdditionalCollarEffect = addAdditionalCollarEffect;