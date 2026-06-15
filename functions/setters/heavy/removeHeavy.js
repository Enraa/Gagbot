const { markForSave } = require("../../other/markForSave");

/*********
 * Remove Heavy Bondage from user. If **type** is not specified, will remove the first heavy bondage in the list. 
 * 
 * - (user id) user - The user to remove heavy bondage for
 * - (string) type - The specific heavy bondage to remove
 * - (boolean) force? - If true, removes all heavy bondage
 *********/
const removeHeavy = (user, type, force) => {
	if (process.heavy == undefined) {
		process.heavy = {};
	}
    if (process.heavy[user] && process.heavy[user].typeval && process.onremovefunctions && process.onremovefunctions.heavy && process.onremovefunctions.heavy[process.heavy[user].typeval]) {
        process.onremovefunctions.heavy[process.heavy[user].typeval](user);
    }
    if (process.heavy[user]) {
        if (type) {
            let find = process.heavy[user].findIndex((h) => h.type === type)
            if (find > -1) {
                if (process.heavy[user][find] && process.onremovefunctions && process.onremovefunctions.heavy && process.onremovefunctions.heavy[process.heavy[user][find].type]) {
                    process.onremovefunctions.heavy[process.heavy[user][find].type](user);
                }
                process.heavy[user].splice(find,1);
            }
        }
        else {
            if (process.heavy[user][0] && process.onremovefunctions && process.onremovefunctions.heavy && process.onremovefunctions.heavy[process.heavy[user][0].type]) {
                process.onremovefunctions.heavy[process.heavy[user][0].type](user);
            }
            process.heavy[user].splice(0,1);
        }
    }
    if ((process.heavy[user]?.length == 0) || force) {
        delete process.heavy[user]
    }
	markForSave("heavy");
};

exports.removeHeavy = removeHeavy;