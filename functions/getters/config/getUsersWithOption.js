const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*********
 * Fetches a list of all user IDs where option == value
 * 
 * - (server id) serverID - The server this is running on
 * - (string) option - The string name of the config option
 * - (any) value - The exact value to check
 * ---
 * ##### Returns an array of user IDs that have selected that value for that option.
 *********/
function getUsersWithOption(serverID, option, value) {
    traceFirstParam(arguments[0]);
    let userswithval = [];
    if (process.configs && process.configs.users && process.configs.users[serverID]) {
        Object.keys(rocess.configs.users[serverID]).forEach((user) => {
            if (rocess.configs.users[serverID][option] == value) {
                userswithval.push(user)
            }
        })
    }
    return userswithval;
}

exports.getUsersWithOption = getUsersWithOption;