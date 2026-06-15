const { getHeavy } = require("./getHeavy");

/********
 * Get the person who applied heavy bondage to the user.
 * 
 * - (user id) user - The person wearing the heavy bondage
 * - (string) type - The specific heavy bondage ID. If unspecified, returns the first heavy bondage
 * ---
 * ##### Returns a user ID who put this heavy bondage on the user. 
 ********/
function getHeavyBinder(user, type) {
    if (getHeavy(user)) {
        if (type) {
            return getHeavy(user, type)?.origbinder
        }
        else {
            return getHeavy(user)?.origbinder
        }
    };
}

exports.getHeavyBinder = getHeavyBinder;