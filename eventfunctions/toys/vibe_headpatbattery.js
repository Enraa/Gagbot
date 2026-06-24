const { getBotOption } = require("../../functions/getters/config/getBotOption");
const { getOption } = require("../../functions/getters/config/getOption");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar } = require("../../functions/setters/config/setUserVar");
const { getTextGeneric } = require("../../functions/textfunctions");

// Successful headpats will recharge the battery on the recipient's vibe by 5%. Each minute drains 2%. 
function headpatfunction(serverID, recipient, data) {
    let newcharge = (getUserVar(serverID, recipient, "headpatvibecharge") ?? 0.0)
    if (data.returnedobject.hit) {
        if (newcharge == 0.0) {
            setTimeout(() => {
                messageSendChannel(`The headpat gives enough charge to start up a vibrator...`, process.recentmessages[serverID][recipient])
            }, 3000)
        }
        newcharge = newcharge + (0.05 * getOption(serverID, recipient, "headpatrestraintpotency"))
        if (data.returnedobject.crit) {
            newcharge = newcharge + (0.05 * getOption(serverID, recipient, "headpatrestraintpotency")) // double charge for crits
        }
    }
    setUserVar(serverID, recipient, "headpatvibecharge", newcharge);
}

// Update battery
async function tick(serverID, userid) {
    let newcharge = 0.0
    if (getUserVar(serverID, userid, "headpatvibecharge")) {
        newcharge = getUserVar(serverID, userid, "headpatvibecharge") - 0.02 * (getBotOption("bot-timetickrate") / 60000)
    }
    if (getUserVar(serverID, userid, "headpatvibecharge") > 1.0) { 
        newcharge = 1.0
    }
    if (getUserVar(serverID, userid, "headpatvibecharge") < 0.0) {
        newcharge = 0.0
    }
    setUserVar(serverID, userid, "headpatvibecharge", newcharge);
}

exports.tick = tick;
exports.headpatfunction = headpatfunction;