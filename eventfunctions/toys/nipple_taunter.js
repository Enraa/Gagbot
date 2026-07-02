const { getPronouns } = require("../../functions/getters/config/getPronouns");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { getHeavyRestrictions } = require("../../functions/getters/heavy/getHeavyRestrictions");
const { getMitten } = require("../../functions/getters/mitten/getMitten");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { addArousal } = require("../../functions/setters/arousal/addArousal");
const { setUserVar } = require("../../functions/setters/config/setUserVar");

async function tick(serverID, userID) {
    if (getUserVar(serverID, userID, "helplesslytaunted")) {
        if ((getHeavyRestrictions(serverID, userID).touchself && !getMitten(serverID, userID))) {
            // They aren't helpless anymore!
            setUserVar(serverID, userID, "helplesslytaunted", undefined);
        }
    }
    else {
        if ((!getHeavyRestrictions(serverID, userID).touchself || getMitten(serverID, userID))) {
            if (getRecentChannel(serverID, userID).valid) {
                messageSendChannel(`As <@${userID}> becomes helpless, ${getPronouns(serverID, userID, "possessiveDeterminer")} taunting nipple massagers activate and provide a relentless assault of pleasure to ${getPronouns(serverID, userID, "possessiveDeterminer")} nipples!`, getRecentChannel(serverID, userID).channelid)
            }
            addArousal(serverID, userID, 5.0);
            setUserVar(serverID, userID, "helplesslytaunted", true);
        }
    }
}

exports.tick = tick;