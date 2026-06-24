const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getOption } = require("../config/getOption");

/********
 * Determines if a toy is arousing and blocks it on the user if they do not have arousal enabled
 * 
 * - (server id) serverID - The server this is running on 
 * - (user id) user - The user receiving the toy
 * - (string) toy - The type ID of the toy
 * ---
 * ##### Returns true if the user has arousal disabled and the toy is arousing, false if permitted or the toy isnt arousing
 ********/
function userBlockArousingToy(serverID, user, toy) {
    traceFirstParam(arguments[0]);
    if (toy && (getOption(serverID, user, "arousalsystem") == 0) && (process.toytypes[toy].isArousing())) {
        return true; // Do not add a toy that can increase arousal, thats bad. 
    }
    else {
        return false;
    }
}

exports.userBlockArousingToy = userBlockArousingToy;