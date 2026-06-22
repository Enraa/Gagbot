const { messageSendChannel } = require("../../functions/messagefunctions")
const { getPronouns } = require("../../functions/getters/config/getPronouns.js");
const { addArousal } = require("../../functions/setters/arousal/addArousal.js");
const { getGag } = require("../../functions/getters/gag/getGag.js");
const { assignGag } = require("../../functions/setters/gag/assignGag.js");
const { deleteGag } = require("../../functions/setters/gag/removeGag.js");
const { getUserVar } = require("../../functions/getters/config/getUserVar.js");
const { setUserVar } = require("../../functions/setters/config/setUserVar.js");

const DISSOLVE_RATE_MS = 60000;

async function tick(serverID, userID, data) {
    // Init Countdown Variable on First Run if not already present
    if (getUserVar(serverID, userID, "aphroConfectionaryDissolveTimer") == undefined) {
        setUserVar(serverID, userID, "aphroConfectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)
        // init the Aphrodisiac Counter
        setUserVar(serverID, userID, "aphroCount", 1)
    }

    // Decrement Intensity every timer interval
    if (getUserVar(serverID, userID, "aphroConfectionaryDissolveTimer") < Date.now() && getGag(serverID, userID, "chocolate~") && process.recentmessages[serverID][userID]) {
        if(getGag(serverID, userID, "chocolate~").intensity > 1){
            setUserVar(serverID, userID, "aphroConfectionaryDissolveTimer", Date.now() + DISSOLVE_RATE_MS)

            // Get Intensity and push decremented version
            let oldIntensity = getGag(serverID, userID, "chocolate~").intensity
            assignGag(serverID, userID, "chocolate~", oldIntensity - 1)

            // Add arousal, growing with each count of chocolate melted then increment the count
            addArousal(serverID, userID, (0.2 * getUserVar(serverID, userID, "aphroCount")))
            setUserVar(serverID, userID, "aphroCount", getUserVar(serverID, userID, "aphroCount") + 1)

            messageSendChannel(`<@${userID}>'s licking has shrunk ${getPronouns(serverID, userID, "possessiveDeterminer")} Chocolate Gag a little bit. The chocolate was particularly tasty and makes ${getPronouns(serverID, userID, "object")} a little warm inside!`, process.recentmessages[serverID][userID])
        }
        else {
            // Clear Gag and Dissolve Timer
            setUserVar(serverID, userID, "aphroConfectionaryDissolveTimer", undefined)

            // Add final double strength burst of arousal as they finish the chocolate then clear counter
            addArousal(serverID, userID, (0.4 * getUserVar(serverID, userID, "aphroCount")))
            setUserVar(serverID, userID, "aphroCount", undefined)

            deleteGag(serverID, userID, "chocolate~")
            messageSendChannel(`<@${userID}>'s Chocolate Gag has dissolved away, leaving haunting memories of how good it tasted and how much ${getPronouns(serverID, userID, "subject")} want${(getPronouns(serverID, userID, "subject") == "they") ? "" : "s"} to touch down there...`, process.recentmessages[serverID][userID])
        }
    }
}

exports.tick = tick;