/*********
 * Fetches a list of all user IDs where option == value
 * 
 * - (string) option - The string name of the config option
 * - (any) value - The exact value to check
 * ---
 * ##### Returns an array of user IDs that have selected that value for that option.
 *********/
function getUsersWithOption(option, value) {
    let userswithval = [];
    if (process.configs && process.configs.users) {
        Object.keys(process.configs.users).forEach((user) => {
            if (process.configs.users[option] == value) {
                userswithval.push(user)
            }
        })
    }
    return userswithval;
}

exports.getUsersWithOption = getUsersWithOption;