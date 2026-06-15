const { calcBreath } = require("../../corsetfunctions");


/*********
 * Gets the current breath of the user
 * 
 * - (user id) user - The user wearing the corset
 * ---
 * ##### Returns the calculated breath of the user
 *********/
function getBreath(user) {
    const corset = calcBreath(user);
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.corset = true;
    return corset.breath;
}

exports.getBreath = getBreath;