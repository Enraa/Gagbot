const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*********
 * Fetches a list of all users setting for option mapped by user ID
 * 
 * - (server id) serverID - The server this is running on
 * - (string) option - The string name of the config option
 * ---
 * ##### Returns an object with keys corresponding to their set value
 *********/
function getAllSelectedOption(serverID, option) {
    traceFirstParam(arguments[0]);
    let selectedoption = {};
    if (process.configs && process.configs.users && process.configs.users[serverID]) {
        Object.keys(process.configs.users[serverID]).forEach((user) => {
            selectedoption[user] = process.configs.users[serverID][user][option]
        })
    }
    return selectedoption;
}

exports.getAllSelectedOption = getAllSelectedOption;