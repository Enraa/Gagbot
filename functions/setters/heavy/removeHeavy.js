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
    if (process.heavy[serverID][user]) {
        if (type) {
            let find = process.heavy[serverID][user].findIndex((h) => h.type === type)
            if (find > -1) {
                tryToCallOnRemoveFunction(serverID, user, type);
                process.heavy[serverID][user].splice(find,1);
            }
        }
        else {
            tryToCallOnRemoveFunction(serverID, user, process.heavy[serverID][user][0].type);
            process.heavy[serverID][user].splice(0,1);
        }
    }
    if ((process.heavy[serverID][user]?.length == 0) || force) {

        // Let's check if there is still heavy bondage on the user and if it's force. If so, let's call the functiononremove for each heavy bondage still here.
        if(process.heavy[serverID][user]?.length != 0 && force) {
            for(let i = 0; i < process.heavy[serverID][user]?.length; i++) {
                tryToCallOnRemoveFunction(serverID, user, process.heavy[serverID][user][i].type);
            }
        }

        delete process.heavy[serverID][user]
    }
	markForSave("heavy");
};

function tryToCallOnRemoveFunction(serverID, user, type) {
    if (type && process.eventfunctions && process.eventfunctions.heavy && process.eventfunctions.heavy[type] && process.eventfunctions.heavy[type].functiononremove) {
        process.eventfunctions.heavy[type].functiononremove(serverID, user);
    }
}

exports.removeHeavy = removeHeavy;