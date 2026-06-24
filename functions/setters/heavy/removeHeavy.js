const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*********
 * Remove Heavy Bondage from user. If **type** is not specified, will remove the first heavy bondage in the list. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user to remove heavy bondage for
 * - (string) type - The specific heavy bondage to remove
 * - (boolean) force? - If true, removes all heavy bondage
 * ---
 * ##### There is currently a bug with onremove functions that should be investigated. 
 *********/
function removeHeavy(serverID, user, type, force) {
    traceFirstParam(arguments[0]);
	if (process.heavy == undefined) {
		process.heavy = {};
	}
    if (process.heavy[serverID] == undefined) {
		process.heavy[serverID] = {};
	}
    if (process.heavy[serverID][user] && process.heavy[serverID][user].typeval && process.onremovefunctions && process.onremovefunctions.heavy && process.onremovefunctions.heavy[process.heavy[serverID][user].typeval]) {
        process.onremovefunctions.heavy[process.heavy[serverID][user].typeval](user);
    }
    if (process.heavy[serverID][user]) {
        if (type) {
            let find = process.heavy[serverID][user].findIndex((h) => h.type === type)
            if (find > -1) {
                if (process.heavy[serverID][user][find] && process.onremovefunctions && process.onremovefunctions.heavy && process.onremovefunctions.heavy[process.heavy[serverID][user][find].type]) {
                    process.onremovefunctions.heavy[process.heavy[serverID][user][find].type](user);
                }
                process.heavy[serverID][user].splice(find,1);
            }
        }
        else {
            if (process.heavy[serverID][user][0] && process.onremovefunctions && process.onremovefunctions.heavy && process.onremovefunctions.heavy[process.heavy[serverID][user][0].type]) {
                process.onremovefunctions.heavy[process.heavy[serverID][user][0].type](user);
            }
            process.heavy[serverID][user].splice(0,1);
        }
    }
    if ((process.heavy[serverID][user]?.length == 0) || force) {
        delete process.heavy[serverID][user]
    }
	markForSave("heavy");
};

exports.removeHeavy = removeHeavy;