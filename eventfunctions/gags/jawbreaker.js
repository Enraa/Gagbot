const { getOption } = require("../../functions/configfunctions")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getGag, assignGag, deleteGag} = require("../../functions/gagfunctions.js");

const DISSOLVE_RATE_MS = 1200000;

async function functiontick(userID) {
    // Init Countdown Variable on First Run if not already present
    if (getUserVar(userID, "confectionaryDissolveTimer") == undefined) {
        setUserVar(userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
    }

    // Decrement Intensity every timer interval
    if (getUserVar(userID, "confectionaryDissolveTimer") < Date.now() && getGag(userID, "jawbreaker") && process.recentmessages[userID]) {
        if(getGag(userID, "jawbreaker").intensity > 1){
            setUserVar(userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
            // Get Intensity and push decremented version
            let oldIntensity = getGag(userID, "jawbreaker").intensity
            assignGag(userID, "jawbreaker", oldIntensity - 1)
            messageSendChannel(`<@${userID}>'s licking has shrunk ${getPronouns(userID, "reflexive")} Jawbreaker Gag a little bit!`, process.recentmessages[userID])
        }
        else {
            // Clear Gag and Dissolve Timer
            setUserVar(userID, "confectionaryDissolveTimer", undefined)
            deleteGag(userID, "jawbreaker")
            messageSendChannel(`<@${userID}>'s Jawbreaker Gag has dissolved away!`, process.recentmessages[userID])
        }
    }
}

exports.functiontick = functiontick;