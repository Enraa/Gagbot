const { getPronouns } = require("../../functions/getters/config/getPronouns");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar } = require("../../functions/setters/config/setUserVar");

function msgfunction(userid, data) {
    if (getUserVar(userid, "motionplugtime") == undefined) {
        if (process.recentmessages[userid]) {
            try {
                messageSendChannel(`<@${userid}>'s movement turns on ${getPronouns(userid, "possessiveDeterminer")} Motion Sensitive Plug!`, process.recentmessages[userid])
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    setUserVar(userid, "motionplugtime", Date.now() + 180000)
    return;
}

async function tick(userID) {
    if (getUserVar(userID, "motionplugtime") < Date.now()) {
        console.log(`Ending Motion Sensitive plug for ${userID}`)
        setUserVar(userID, "motionplugtime", undefined)
    }
}

exports.tick = tick;
exports.msgfunction = msgfunction;