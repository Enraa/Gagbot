const { getProcessVariable } = require("./getProcessVariable")

/************
 * Gets the most recent channel the bot saw the user talk in or perform an interaction in. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is checking against
 * ---
 * ##### Returns an object with the following properties. In the case that there is no recent channel, channelid and timestamp will be 0. 
 * - channelid: The channel the user most recently interacted in
 * - timestamp: The date the user interacted at
 * - valid: If false, this was a failed channel retrieve
 ************/
function getRecentChannel(serverID, userID) {
    let returned = {
        channelid: "0",
        timestamp: 0,
        interactionchannelid: "0",
        interactiontimestamp: 0,
        messagechannelid: "0",
        messagetimestamp: 0,
        valid: false
    }
    if (getProcessVariable(serverID, userID, "recentmessages")) {
        returned = getProcessVariable(serverID, userID, "recentmessages");
        returned.valid = true;
    }
    return returned;
}

exports.getRecentChannel = getRecentChannel;