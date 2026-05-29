const { getOption } = require("../../functions/configfunctions")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getGag, assignGag, deleteGag} = require("../../functions/gagfunctions.js");
const { getPronouns } = require("../../functions/pronounfunctions.js");
const { addArousal, getArousal } = require("../../functions/vibefunctions");

const DISSOLVE_RATE_MS = 60000;

async function tick(userID, data) {
    // Init Countdown Variable on First Run if not already present
    if (getUserVar(userID, "confectionaryDissolveTimer") == undefined) {
        setUserVar(userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
        // init the Aphrodisiac Counter
        setUserVar(userID, "aphrodisiacCount", 0)
    }

    // Decrement Intensity every timer interval
    if (getUserVar(userID, "confectionaryDissolveTimer") < Date.now() && getGag(userID, "chocolate") && process.recentmessages[userID]) {
        if(getGag(userID, "chocolate").intensity > 1){
            setUserVar(userID, "confectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)

            // Get Intensity and push decremented version
            let oldIntensity = getGag(userID, "chocolate").intensity
            assignGag(userID, "chocolate", oldIntensity - 1)

            // Add arousal, growing with each count of chocolate melted then increment the count
            addArousal(userID, (0.2 * getUserVar(userID, "aphrodisiacCount")))
            setUserVar(userID, "aphrodisiacCount", getUserVar(userID, "aphrodisiacCount") + 1)

            messageSendChannel(`<@${userID}>'s licking has shrunk ${getPronouns(userID, "possessiveDeterminer")} Chocolate Gag a little bit, releasing a little bit of aphrodisiac~!`, process.recentmessages[userID])
        }
        else {
            // Clear Gag and Dissolve Timer
            setUserVar(userID, "confectionaryDissolveTimer", undefined)

            // Add final double strength burst of arousal as they finish the chocolate then clear counter
            addArousal(userID, (0.4 * getUserVar(userID, "aphrodisiacCount")))
            setUserVar(userID, "aphrodisiacCount", undefined)

            deleteGag(userID, "chocolate")
            messageSendChannel(`<@${userID}>'s Chocolate Gag has dissolved away with a final burst of aphrodisiac!`, process.recentmessages[userID])
        }
    }
}

exports.tick = tick;