const { getCollar } = require("../../functions/collarfunctions");
const { getBotOption } = require("../../functions/configfunctions");
const { assignGag } = require("../../functions/gagfunctions");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { getPronouns } = require("../../functions/pronounfunctions");
const { getTextGeneric } = require("../../functions/textfunctions");
const { getUserVar, setUserVar } = require("../../functions/usercontext");

// Successful headpats will recharge the battery on the recipient's vibe by 5%. Each minute drains 2%. 
function headpatfunction(recipient, headpatter, returnedobject) {
    let newcharge = (getUserVar(recipient, "headpatvibecharge") ?? 0.0)
    if (newcharge == 0.0) {
        messageSendChannel(`The headpat gives enough charge to start up a vibrator...`, process.recentmessages[recipient])
    }
    if (returnedobject.hit) {
        newcharge = newcharge + 0.05
        if (returnedobject.crit) {
            newcharge = newcharge + 0.05 // double charge for crits
        }
    }
    setUserVar(recipient, "headpatvibecharge", newcharge);
}

// Update battery
async function functiontick(userid) {
    let newcharge = 0.0
    if (getUserVar(userid, "headpatvibecharge")) {
        newcharge = getUserVar(userid, "headpatvibecharge") - 0.02 * (getBotOption("bot-timetickrate") / 60000)
    }
    if (getUserVar(userid, "headpatvibecharge") > 1.0) { 
        newcharge = 1.0
    }
    if (getUserVar(userid, "headpatvibecharge") < 0.0) {
        newcharge = 0.0
    }
    setUserVar(userid, "headpatvibecharge", newcharge);
}

exports.functiontick = functiontick;
exports.headpatfunction = headpatfunction;