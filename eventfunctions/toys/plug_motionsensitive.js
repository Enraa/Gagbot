const { getPronouns } = require("../../functions/getters/config/getPronouns");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar } = require("../../functions/setters/config/setUserVar");

function msgfunction(serverID, userid, data) {
    if (getUserVar(serverID, userid, "motionplugtime") == undefined) {
        if (getRecentChannel(serverID, userid).valid) {
            try {
                messageSendChannel(`<@${userid}>'s movement turns on ${getPronouns(serverID, userid, "possessiveDeterminer")} Motion Sensitive Plug!`, getRecentChannel(serverID, userid).channelid)
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    setUserVar(serverID, userid, "motionplugtime", Date.now() + 180000)
    return;
}

async function tick(serverID, userID) {
    if (getUserVar(serverID, userID, "motionplugtime") < Date.now()) {
        console.log(`Ending Motion Sensitive plug for ${userID}`)
        setUserVar(serverID, userID, "motionplugtime", undefined)
    }
}

exports.tick = tick;
exports.msgfunction = msgfunction;