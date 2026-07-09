const { getBotOption } = require("../../functions/getters/config/getBotOption");
const { getOption } = require("../../functions/getters/config/getOption");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar } = require("../../functions/setters/config/setUserVar");

// Successful headpats will increase the windup on the wearer by 15 minutes, up to 3 hours. This is 1/12th of the charge, or 8.33%. 
function headpatfunction(serverID, recipient, data) {
    let newcharge = (getUserVar(serverID, recipient, "windupcharge") ?? 0.0)
    if (data.returnedobject.hit) {
        if (newcharge == 0.0) {

        }
        newcharge = newcharge + ((15/180) * getOption(serverID, recipient, "headpatrestraintpotency"))
        if (data.returnedobject.crit) {
            newcharge = newcharge + ((15/180) * getOption(serverID, recipient, "headpatrestraintpotency")) // double charge for crits
        }
    }
    setUserVar(serverID, recipient, "windupcharge", newcharge);
}

// Update battery
async function tick(serverID, userid, datain) {
    let newcharge = 0.0
    if (getUserVar(serverID, userid, "windupcharge")) {
        newcharge = getUserVar(serverID, userid, "windupcharge") - (1/180) * (getBotOption("bot-timetickrate") / 60000)
    }
    if (getUserVar(serverID, userid, "windupcharge") > 1.0) { 
        newcharge = 1.0
    }
    if (getUserVar(serverID, userid, "windupcharge") < 0.0) {
        newcharge = 0.0
    }
    if (getUserVar(serverID, userid, "windupcharge") > 0.0 && (newcharge <= 0.0)) {
        // They JUST ran out of charge...
        messageSendChannel(`<@${userid}> becomes dormant as the clockwork key stops ticking...`, getRecentChannel(serverID, userID).channelid)
    }
    setUserVar(serverID, userid, "windupcharge", newcharge);
}

exports.tick = tick;
exports.headpatfunction = headpatfunction;