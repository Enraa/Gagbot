const { getCurrentFloor } = require("../../getters/delve/getCurrentFloor");
const { getDelvePlayerStats } = require("../../getters/delve/getDelvePlayerStats");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/*********
 * Sets the next Delve room by choice. If choice is not specified, the user is starting a new delve. This will always default to the delveentrance room.
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) user - The user ID doing the delve
 * - (string) choice - The prop name in delveroomchoices
 * ---
 * ##### *No return value*
 *********/
function setNextDelveRoom(serverID, user, choice) {
    traceFirstParam(arguments[0]);
    if ((getCurrentFloor(serverID, user) == undefined)) {
        process.delveuserdata[serverID][user] = {
            floorarr: ["delveentrance"],
            floorscompleted: -1,
            floor: 0,
            tempbuffs: [],
            resolve: 10 + Math.round(getDelvePlayerStats(serverID, user).stamina / 2)
        }
        markForSave("delveuserdata");
    }
    else {
        process.delveuserdata[serverID][user].floorarr.push(choice);
    }
}

exports.setNextDelveRoom = setNextDelveRoom;