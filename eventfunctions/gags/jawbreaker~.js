const { messageSendChannel } = require("../../functions/messagefunctions")
const { getPronouns } = require("../../functions/getters/config/getPronouns.js");
const { addArousal } = require("../../functions/setters/arousal/addArousal.js");
const { getGag } = require("../../functions/getters/gag/getGag.js");
const { assignGag } = require("../../functions/setters/gag/assignGag.js");
const { deleteGag } = require("../../functions/setters/gag/removeGag.js");
const { getUserVar } = require("../../functions/getters/config/getUserVar.js");
const { setUserVar } = require("../../functions/setters/config/setUserVar.js");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel.js");

const DISSOLVE_RATE_MS = 1200000;

async function tick(serverID, userID, data) {
    // Init Countdown Variable on First Run if not already present
    if (getUserVar(serverID, userID, "confectionaryDissolveTimer") == undefined) {
        setUserVar(serverID, userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
    }

    // Decrement Intensity every timer interval
    if (getUserVar(serverID, userID, "confectionaryDissolveTimer") < Date.now() && getGag(serverID, userID, "jawbreaker~") && getRecentChannel(serverID, userID).valid) {
        if(getGag(serverID, userID, "jawbreaker~").intensity > 1){
            setUserVar(serverID, userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
            // Get Intensity and push decremented version
            let oldIntensity = getGag(serverID, userID, "jawbreaker~").intensity
            assignGag(serverID, userID, "jawbreaker~", oldIntensity - 1)
            messageSendChannel(`<@${userID}>'s licking has shrunk ${getPronouns(serverID, userID, "possessiveDeterminer")} Jawbreaker Gag a little bit! The sacchrine flavors remind ${getPronouns(serverID, userID, "object")} of wonderful things!`, getRecentChannel(serverID, userID).channelid)
        }
        else {
            // Clear Gag and Dissolve Timer
            setUserVar(serverID, userID, "confectionaryDissolveTimer", undefined)
            deleteGag(serverID, userID, "jawbreaker~")
            // Apply Burst of Arousal
            addArousal(serverID, userID, 10)

            messageSendChannel(`<@${userID}>'s Jawbreaker Gag dissolves away, but the sweet juices of the candy linger on ${getPronouns(serverID, userID, "possessiveDeterminer")} tongue, along with a desire to share them with someone!`, getRecentChannel(serverID, userID).channelid)
        }
    }
}

exports.tick = tick;