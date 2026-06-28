const { getArousal } = require("../../functions/getters/arousal/getArousal");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { addArousal } = require("../../functions/setters/arousal/addArousal");
const { clearArousal } = require("../../functions/setters/arousal/clearArousal");
const { setUserVar } = require("../../functions/setters/config/setUserVar");

async function tick(serverID, userID, data) {
    // Configure base arousal value
    if (!getUserVar(serverID, userID, "base_arousal") || getUserVar(serverID, userID, "base_arousal") == undefined) setUserVar(serverID, userID, "base_arousal", getArousal(serverID, userID) ?? 0);

    // Set next time if it is undefined
    if (!getUserVar(serverID, userID, "cyclical_nexttick") || getUserVar(serverID, userID, "cyclical_nexttick") == undefined) setUserVar(serverID, userID, "cyclical_nexttick", Date.now() + 180000);

    // If the current tick is in the past, then we've waited 3 minutes
    if (getUserVar(serverID, userID, "cyclical_nexttick") < Date.now()) {
        try {
            console.log(`Cyclical reset of arousal for ${userID} back to ${getUserVar(serverID, userID, "base_arousal")}`)
            clearArousal(serverID, userID);
            addArousal(serverID, userID, getUserVar(serverID, userID, "base_arousal"));
            setUserVar(serverID, userID, "cyclical_nexttick", Date.now() + 180000)
        }
        catch (err) {
            console.log(err)
        }
    }
}

exports.tick = tick;