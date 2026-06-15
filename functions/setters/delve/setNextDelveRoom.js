const { getCurrentFloor } = require("../../getters/delve/getCurrentFloor");
const { getDelvePlayerStats } = require("../../getters/delve/getDelvePlayerStats");
const { markForSave } = require("../../other/markForSave");

/*********
 * Sets the next Delve room by choice. If choice is not specified, the user is starting a new delve. This will always default to the delveentrance room.
 * 
 * - (user ID) user - The user ID doing the delve
 * - (string) choice - The prop name in delveroomchoices
 * ---
 * ##### *No return value*
 *********/
function setNextDelveRoom(user, choice) {
    if ((getCurrentFloor(user) == undefined)) {
        process.delveuserdata[user] = {
            floorarr: ["delveentrance"],
            floorscompleted: -1,
            floor: 0,
            tempbuffs: [],
            resolve: 10 + Math.round(getDelvePlayerStats(user).stamina / 2)
        }
        markForSave("delveuserdata");
    }
    else {
        process.delveuserdata[user].floorarr.push(choice);
    }
}

exports.setNextDelveRoom = setNextDelveRoom;