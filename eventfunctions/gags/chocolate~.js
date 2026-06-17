const { messageSendChannel } = require("../../functions/messagefunctions")
const { getPronouns } = require("../../functions/getters/config/getPronouns.js");
const { addArousal } = require("../../functions/setters/arousal/addArousal.js");
const { getGag } = require("../../functions/getters/gag/getGag.js");
const { assignGag } = require("../../functions/setters/gag/assignGag.js");
const { deleteGag } = require("../../functions/setters/gag/removeGag.js");
const { getUserVar } = require("../../functions/getters/config/getUserVar.js");
const { setUserVar } = require("../../functions/setters/config/setUserVar.js");

const DISSOLVE_RATE_MS = 60000;

async function tick(userID, data) {
    // Init Countdown Variable on First Run if not already present
    if (getUserVar(userID, "aphroConfectionaryDissolveTimer") == undefined) {
        setUserVar(userID, "aphroConfectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
        // init the Aphrodisiac Counter
        setUserVar(userID, "aphroCount", 1)
    }

    // Decrement Intensity every timer interval
    if (getUserVar(userID, "aphroConfectionaryDissolveTimer") < Date.now() && getGag(userID, "chocolate~") && process.recentmessages[userID]) {
        if(getGag(userID, "chocolate~").intensity > 1){
            setUserVar(userID, "aphroConfectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)

            // Get Intensity and push decremented version
            let oldIntensity = getGag(userID, "chocolate~").intensity
            assignGag(userID, "chocolate~", oldIntensity - 1)

            // Add arousal, growing with each count of chocolate melted then increment the count
            addArousal(userID, (0.2 * getUserVar(userID, "aphroCount")))
            setUserVar(userID, "aphroCount", getUserVar(userID, "aphroCount") + 1)

            messageSendChannel(`<@${userID}>'s licking has shrunk ${getPronouns(userID, "possessiveDeterminer")} Chocolate Gag a little bit. The chocolate was particularly tasty and makes ${getPronouns(userID, "object")} a little warm inside!`, process.recentmessages[userID])
        }
        else {
            // Clear Gag and Dissolve Timer
            setUserVar(userID, "aphroConfectionaryDissolveTimer", undefined)

            // Add final double strength burst of arousal as they finish the chocolate then clear counter
            addArousal(userID, (0.4 * getUserVar(userID, "aphroCount")))
            setUserVar(userID, "aphroCount", undefined)

            deleteGag(userID, "chocolate~")
            messageSendChannel(`<@${userID}>'s Chocolate Gag has dissolved away, leaving haunting memories of how good it tasted and how much ${getPronouns(userID, "subject")} want${(getPronouns(userID, "subject") == "they") ? "" : "s"} to touch down there...`, process.recentmessages[userID])
        }
    }
}

exports.tick = tick;