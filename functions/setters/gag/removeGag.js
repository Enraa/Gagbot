const { markForSave } = require("../../other/markForSave");

/**********
 * Removes a gag from the user.
 * 
 * - (user id) userID - The person wearing the gag
 * - (string) specificgag - The type of gag to remove
 * - (boolean) force - If true, forcibly removes the gag even past the headgear
 * ---
 * ##### *No return value*
 **********/
function deleteGag(userID, specificgag, force = false) {
	if (process.gags == undefined) {
		process.gags = {};
	}
	// Remove all gags if none is specified.
	if (!specificgag && process.gags[userID]) {
        let lockedheadgears = [];
        if (process.headwear[userID]) { lockedheadgears = Object.keys(process.headwear[userID]) }
        if ((lockedheadgears.length <= 1) || force) {
            // They dont have anything locked on their head, business as usual. 
            process.gags[userID].forEach((g) => {
                if (process.gagtypes[g.gagtype] && process.gagtypes[g.gagtype].onUnlock) {
                    process.gagtypes[g.gagtype].onUnlock(userID);
                }
            })
            delete process.gags[userID];
        }
        else {
            process.gags[userID].forEach((g) => {
                if (process.gagtypes[g.gagtype] && process.gagtypes[g.gagtype].onUnlock) {
                    process.gagtypes[g.gagtype].onUnlock(userID);
                }
                if (!process.headwear[userID][`gagharness_${g.gagtype}`]) {
                    // Splice out any gags that are eligible to be removed. 
                    let loc = process.gags[userID].findIndex((f) => f.gagtype == g.gagtype);
                    process.gags[userID].splice(loc, 1);
                }
            })
        }
	} else if (process.gags[userID]) {
		let loc = process.gags[userID].findIndex((f) => f.gagtype == specificgag);
		if (loc > -1) {
            if (process.gagtypes[process.gags[userID][loc].gagtype] && process.gagtypes[process.gags[userID][loc].gagtype].onUnlock) {
                process.gagtypes[process.gags[userID][loc].gagtype].onUnlock({ userID: userID });
            }
			process.gags[userID].splice(loc, 1);
		}
		if (process.gags[userID].length == 0) {
			delete process.gags[userID];
		}
	}
	markForSave("gags");
};

exports.deleteGag = deleteGag;
exports.removeGag = deleteGag;