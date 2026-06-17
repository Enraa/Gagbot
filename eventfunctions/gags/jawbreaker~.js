const { getOption } = require("../../functions/configfunctions")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getGag, assignGag, deleteGag} = require("../../functions/gagfunctions.js");
const { getPronouns } = require("../../functions/pronounfunctions.js");
const { addArousal, getArousal } = require("../../functions/vibefunctions");

const DISSOLVE_RATE_MS = 1200000;

async function tick(userID, data) {
    // Init Countdown Variable on First Run if not already present
    if (getUserVar(userID, "confectionaryDissolveTimer") == undefined) {
        setUserVar(userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
    }

    // Decrement Intensity every timer interval
    if (getUserVar(userID, "confectionaryDissolveTimer") < Date.now() && getGag(userID, "jawbreaker~") && process.recentmessages[userID]) {
        if(getGag(userID, "jawbreaker~").intensity > 1){
            setUserVar(userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
            // Get Intensity and push decremented version
            let oldIntensity = getGag(userID, "jawbreaker~").intensity
            assignGag(userID, "jawbreaker~", oldIntensity - 1)
            messageSendChannel(`<@${userID}>'s licking has shrunk ${getPronouns(userID, "possessiveDeterminer")} Jawbreaker Gag a little bit! The sacchrine flavors remind ${getPronouns(userID, "object")} of wonderful things!`, process.recentmessages[userID])
        }
        else {
            // Clear Gag and Dissolve Timer
            setUserVar(userID, "confectionaryDissolveTimer", undefined)
            deleteGag(userID, "jawbreaker~")
            // Apply Burst of Arousal
            addArousal(userID, 10)

            messageSendChannel(`<@${userID}>'s Jawbreaker Gag dissolves away, but the sweet juices of the candy linger on ${getPronouns(userID, "possessiveDeterminer")} tongue, along with a desire to share them with someone!`, process.recentmessages[userID])
        }
    }
}

exports.tick = tick;