const { getCollar } = require("../../functions/getters/collar/getCollar");
const { getPronouns } = require("../../functions/getters/config/getPronouns");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar } = require("../../functions/setters/config/setUserVar");
const { getTextGeneric } = require("../../functions/textfunctions");

// Since headpats can only ever crit if they hit, then we should just simply check for that! 
function headpatfunction(recipient, data) {
    const critheadpatmessages = [
        `The headpat felt so good that it left <@${recipient}> stunned for a few moments! One could capitalize on this opportunity to further bind ${getPronouns(recipient, "object")}!`,
        `<@${recipient}>'s eyes are a bit hazy as ${getPronouns(recipient, "subject")} is lost in thought after that headpat. ${getPronouns(recipient, "subject", true)} could easily be bound right now...`,
        `Unexpectedly, <@${recipient}>'s movements look a little sluggish. Now would be the best time to combo ${getPronouns(recipient, "object")} with bondage!`,
        `<@${recipient}> sighs in delight at receiving that amazing headpat, blissfully unaware of anyone who might want to bind ${getPronouns(recipient, "object")} super tightly!`,
        `<@${recipient}> lowers ${getPronouns(recipient, "possessiveDeterminer")} guard as that headpat was in just the perfect place! ${getPronouns(recipient, "subject", true)} probably won't say no to some bondage!`
    ]
    if (data.returnedobject && data.returnedobject.crit && !getUserVar(recipient, "headpatvulntimer")) {
        try {
            // Delay by 3 seconds to attempt to arrange the order
            setTimeout(() => {
                messageSendChannel(critheadpatmessages[Math.floor(Math.random() * critheadpatmessages.length)], process.recentmessages[recipient])
            }, 3000);
        }
        catch (err) {
            console.log(err)
        }
        setUserVar(recipient, "headpatvulntimer", Date.now() + 300000)
        if (getCollar(recipient).keyholder_only) {
            getCollar(recipient).headpatvulnerable = (Date.now() + 300000);
        }
    }
}

// Clear crit cooldown if we somehow crashed. 
async function tick(userid, data) {
    if (getUserVar(userid, "headpatvulntimer") && (Date.now() > getUserVar(userid, "headpatvulntimer"))) {
        setUserVar(userid, "headpatvulntimer", undefined);
    }
    if (getCollar(userid).headpatvulnerable < Date.now()) {
        getCollar(userid).headpatvulnerable = undefined;
    }
}

exports.tick = tick;
exports.headpatfunction = headpatfunction;