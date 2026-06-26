const { getPronouns } = require("../../functions/getters/config/getPronouns");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { getGag } = require("../../functions/getters/gag/getGag");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar } = require("../../functions/setters/config/setUserVar");
const { assignGag } = require("../../functions/setters/gag/assignGag");
const { removeGag } = require("../../functions/setters/gag/removeGag");

const DISSOLVE_RATE_MS = 300000;

async function tick(serverID, userID, data) {
    // Init Countdown Variable on First Run if not already present
    if (getUserVar(serverID, userID, "confectionaryDissolveTimer") == undefined) {
        setUserVar(serverID, userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
    }

    // Decrement Intensity every timer interval
    if (getUserVar(serverID, userID, "confectionaryDissolveTimer") < Date.now() && getGag(serverID, userID, "gummy") && getRecentChannel(serverID, userID).valid) {
        if(getGag(serverID, userID, "gummy").intensity > 1){
            setUserVar(serverID, userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
            // Get Intensity and push decremented version
            let oldIntensity = getGag(serverID, userID, "gummy").intensity
            assignGag(serverID, userID, "gummy", oldIntensity - 1)
            messageSendChannel(`<@${userID}>'s licking has shrunk ${getPronouns(serverID, userID, "possessiveDeterminer")} Gummy Gag a little bit!`, getRecentChannel(serverID, userID).channelid)
        }
        else {
            // Clear Gag and Dissolve Timer
            setUserVar(serverID, userID, "confectionaryDissolveTimer", undefined)
            removeGag(serverID, userID, "gummy")
            messageSendChannel(`<@${userID}>'s Gummy Gag has dissolved away!`, getRecentChannel(serverID, userID).channelid)
        }
    }
}

exports.tick = tick;