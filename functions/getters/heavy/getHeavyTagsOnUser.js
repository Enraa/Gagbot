const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getBaseHeavy } = require("./getBaseHeavy");
const { getHeavyList } = require("./getHeavyList");

/*********
 * Gets a list of heavy tags affecting a user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) user - The user wearing the heavy bondage
 * ---
 * ##### Returns an array of "arms", "legs", or "container"
 *********/
function getHeavyTagsOnUser(serverID, user) {
    traceFirstParam(arguments[0]);
    if (getHeavyList(serverID, user) == undefined) {
        return []; // They're not bound by anything lol
    }
    else {
        let tags = [];
        getHeavyList(serverID, user).forEach((heavy) => {
            getBaseHeavy(heavy.type).heavytags.forEach((t) => {
                tags.push(t);
            })
        })
        return tags;
    }
}

exports.getHeavyTagsOnUser = getHeavyTagsOnUser;