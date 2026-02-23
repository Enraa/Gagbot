const { getOption } = require("../../functions/configfunctions")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getGag, assignGag, deleteGag} = require("../../functions/gagfunctions.js");

const DISSOLVE_RATE_MS = 300000;

async function functiontick(userID) {
    // Init Countdown Variable on First Run if not already present
    if (getUserVar(userID, "confectionaryDissolveTimer") == undefined) {
        setUserVar(userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
    }

    // Decrement Intensity every timer interval
    if (getUserVar(userID, "confectionaryDissolveTimer") < Date.now() && getGag(userID, "gummy") && process.recentmessages[userID]) {
        if(getGag(userID, "gummy").intensity > 1){
            setUserVar(userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
            // Get Intensity and push decremented version
            let oldIntensity = getGag(userID, "gummy").intensity
            assignGag(userID, "gummy", oldIntensity - 1)
            messageSendChannel(`<@${userID}>'s licking has shrunk ${getPronouns(userID, "reflexive")} Gummy Gag a little bit!`, process.recentmessages[userID])
        }
        else {
            // Clear Gag and Dissolve Timer
            setUserVar(userID, "confectionaryDissolveTimer", undefined)
            deleteGag(userID, "gummy")
            messageSendChannel(`<@${userID}>'s Gummy Gag has dissolved away!`, process.recentmessages[userID])
        }
    }
}

exports.functiontick = functiontick;