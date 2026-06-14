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
            if (process.collar[user].additionalcollars && process.collar[user].additionalcollars.includes(type)) {
                process.collar[user].additionalcollars.splice(process.collar[user].additionalcollars.indexOf(type), 1);
            }
            if (process.collar[user].additionalcollars && process.collar[user].additionalcollars.length == 0) {
                delete process.collar[user].additionalcollars;
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