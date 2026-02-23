const { getOption } = require("../../functions/configfunctions")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getGag, assignGag, deleteGag} = require("../../functions/gagfunctions.js");
const { getPronouns } = require("../../functions/pronounfunctions.js");

const DISSOLVE_RATE_MS = 60000;

async function functiontick(userID) {
    // Init Countdown Variable on First Run if not already present
    if (getUserVar(userID, "confectionaryDissolveTimer") == undefined) {
        setUserVar(userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
    }

    // Decrement Intensity every timer interval
    if (getUserVar(userID, "confectionaryDissolveTimer") < Date.now() && getGag(userID, "chocolate") && process.recentmessages[userID]) {
        if(getGag(userID, "chocolate").intensity > 1){
            setUserVar(userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
            // Get Intensity and push decremented version
            let oldIntensity = getGag(userID, "chocolate").intensity
            assignGag(userID, "chocolate", oldIntensity - 1)
            messageSendChannel(`<@${userID}>'s licking has shrunk ${getPronouns(userID, "reflexive")} Chocolate Gag a little bit!`, process.recentmessages[userID])
        }
        else {
            // Clear Gag and Dissolve Timer
            setUserVar(userID, "confectionaryDissolveTimer", undefined)
            deleteGag(userID, "chocolate")
            messageSendChannel(`<@${userID}>'s Chocolate Gag has dissolved away!`, process.recentmessages[userID])
        }
    }
}

exports.functiontick = functiontick;