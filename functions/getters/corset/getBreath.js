const { calcBreath } = require("../../corsetfunctions");
const { markForSave } = require("../../other/markForSave");


/*********
 * Gets the current breath of the user
 * 
 * - (user id) user - The user wearing the corset
 * ---
 * ##### Returns the calculated breath of the user
 *********/
function getBreath(user) {
    const corset = calcBreath(user);
    markForSave("corset");
    return corset.breath;
}

exports.getBreath = getBreath;