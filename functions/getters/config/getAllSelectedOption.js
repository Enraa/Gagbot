/*********
 * Fetches a list of all users setting for option mapped by user ID
 * 
 * - (string) option - The string name of the config option
 * ---
 * ##### Returns an object with keys corresponding to their set value
 *********/
function getAllSelectedOption(option) {
    let selectedoption = {};
    if (process.configs && process.configs.users) {
        Object.keys(process.configs.users).forEach((user) => {
            selectedoption[user] = process.configs.users[user][option]
        })
    }
    return selectedoption;
}

exports.getAllSelectedOption = getAllSelectedOption;