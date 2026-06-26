const { markForSave } = require("../../other/markForSave");
const { setProcessVariable } = require("./setProcessVariable");
const { getRecentChannel } = require("./../../getters/config/getRecentChannel");

/************
 * Sets the most recent channel the bot saw the user talk in or perform an interaction in. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is setting
 * - (channel id) channelID - The channel this is setting
 * - (string) type - The type of interaction. Used to delineate chatting and interactions. 
 ************/
function setRecentChannel(serverID, userID, channelID, type) {
    let current = getRecentChannel(serverID, userID);
    current.channelid = channelID
    if ((type == "interaction") || (type == "message")) {
        current[`${type}channelid`] = channelID,
        current[`${type}timestamp`] = Date.now()
    }
    current.channelid = channelID,
    current.timestamp = Date.now()
    setProcessVariable(serverID, userID, "recentmessages", current)
}

exports.setRecentChannel = setRecentChannel;