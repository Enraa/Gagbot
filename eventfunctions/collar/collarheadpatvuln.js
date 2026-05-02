const { getCollar } = require("../../functions/collarfunctions");
const { assignGag } = require("../../functions/gagfunctions");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { getPronouns } = require("../../functions/pronounfunctions");
const { getTextGeneric } = require("../../functions/textfunctions");
const { getUserVar, setUserVar } = require("../../functions/usercontext");

// Since headpats can only ever crit if they hit, then we should just simply check for that! 
function headpatfunction(recipient, headpatter, returnedobject) {
    const critheadpatmessages = [
        `The headpat felt so good that it left <@${recipient}> stunned for a few moments! One could capitalize on this opportunity to further bind ${getPronouns(recipient, "object")}!`,
        `<@${recipient}>'s eyes are a bit hazy as ${getPronouns(recipient, "subject")} is lost in thought after that headpat. ${getPronouns(recipient, "subject", true)} could probably easily be bound right now...`
    ]
    if (returnedobject && returnedobject.crit && !getUserVar(recipient, "headpatvulntimer") && getCollar(recipient).keyholder_only) {
        messageSendChannel(critheadpatmessages[Math.floor(Math.random() * critheadpatmessages.length)], process.recentmessages[recipient])
        getCollar(recipient).keyholder_only = false;
        setUserVar(recipient, "headpatvulntimer", Date.now() + 360000)
        setTimeout(() => {
            setUserVar(recipient, "headpatvulntimer", undefined);
            if (getCollar(recipient) && !getCollar(recipient).keyholder_only && getCollar(recipient).collartype == "collarheadpatvuln") {
                getCollar(recipient).keyholder_only = true;
            }
        }, 300000)
    }
}

// Clear crit cooldown if we somehow crashed. 
async function functiontick(userid) {
    if (getUserVar(userid, "headpatvulntimer") && (Date.now() > getUserVar(userid, "headpatvulntimer"))) {
        setUserVar(userid, "headpatvulntimer", undefined);
    }
}

exports.functiontick = functiontick;
exports.headpatfunction = headpatfunction;