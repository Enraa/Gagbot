const { getCollar } = require("../../functions/getters/collar/getCollar");
const { getPronouns } = require("../../functions/getters/config/getPronouns");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar } = require("../../functions/setters/config/setUserVar");
const { getTextGeneric } = require("../../functions/textfunctions");

// Since headpats can only ever crit if they hit, then we should just simply check for that! 
function headpatfunction(serverID, recipient, data) {
    const critheadpatmessages = [
        `The headpat felt so good that it left <@${recipient}> stunned for a few moments! One could capitalize on this opportunity to further bind ${getPronouns(serverID, recipient, "object")}!`,
        `<@${recipient}>'s eyes are a bit hazy as ${getPronouns(serverID, recipient, "subject")} is lost in thought after that headpat. ${getPronouns(serverID, recipient, "subject", true)} could easily be bound right now...`,
        `Unexpectedly, <@${recipient}>'s movements look a little sluggish. Now would be the best time to combo ${getPronouns(serverID, recipient, "object")} with bondage!`,
        `<@${recipient}> sighs in delight at receiving that amazing headpat, blissfully unaware of anyone who might want to bind ${getPronouns(serverID, recipient, "object")} super tightly!`,
        `<@${recipient}> lowers ${getPronouns(serverID, recipient, "possessiveDeterminer")} guard as that headpat was in just the perfect place! ${getPronouns(serverID, recipient, "subject", true)} probably won't say no to some bondage!`
    ]
    if (data.returnedobject && data.returnedobject.crit && !getUserVar(serverID, recipient, "headpatvulntimer")) {
        try {
            // Delay by 3 seconds to attempt to arrange the order
            setTimeout(() => {
                messageSendChannel(critheadpatmessages[Math.floor(Math.random() * critheadpatmessages.length)], getRecentChannel(serverID, recipient).channelid)
            }, 3000);
        }
        catch (err) {
            console.log(err)
        }
        setUserVar(serverID, recipient, "headpatvulntimer", Date.now() + 300000)
        if (getCollar(serverID, recipient).keyholder_only) {
            getCollar(serverID, recipient).headpatvulnerable = (Date.now() + 300000);
        }
    }
}

// Clear crit cooldown if we somehow crashed. 
async function tick(serverID, userid, data) {
    if (getUserVar(serverID, userid, "headpatvulntimer") && (Date.now() > getUserVar(serverID, userid, "headpatvulntimer"))) {
        setUserVar(serverID, userid, "headpatvulntimer", undefined);
    }
    if (getCollar(serverID, userid).headpatvulnerable < Date.now()) {
        getCollar(serverID, userid).headpatvulnerable = undefined;
    }
}

exports.tick = tick;
exports.headpatfunction = headpatfunction;