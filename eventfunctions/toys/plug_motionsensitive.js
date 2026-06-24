const { getPronouns } = require("../../functions/getters/config/getPronouns");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar } = require("../../functions/setters/config/setUserVar");

function msgfunction(serverID, userid, data) {
    if (getUserVar(serverID, userid, "motionplugtime") == undefined) {
        if (process.recentmessages[serverID] && process.recentmessages[serverID][userid]) {
            try {
                messageSendChannel(`<@${userid}>'s movement turns on ${getPronouns(serverID, userid, "possessiveDeterminer")} Motion Sensitive Plug!`, process.recentmessages[serverID][userid])
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