const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel")
const { getUserVar } = require("../../functions/getters/config/getUserVar")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { setUserVar } = require("../../functions/setters/config/setUserVar")
const { honorifictitles } = require("../../lists/politetitles")

async function tick(serverID, userID, data) {
    // Remind them on the third infraction and reset
    if ((getUserVar(serverID, userID, "politeSubSilences") > 2) && getRecentChannel(serverID, userID).valid) {
        let honorifictitlespart = honorifictitles.slice(Math.min(Math.floor(honorifictitles.length * Math.random()), honorifictitles.length - 4), 3)
        messageSendChannel(`<@${userID}> should speak with titles to people, such as ${honorifictitlespart.join(", ")} and the like.`, getRecentChannel(serverID, userID).channelid)
        setUserVar(serverID, userID, "politeSubSilenceTime", undefined)
        setUserVar(serverID, userID, "politeSubSilences", undefined)
    }
    if (getUserVar(serverID, userID, "politeSubSilenceTime") < Date.now()) {
        console.log(`Clearing silence timer for ${userID}`)
        setUserVar(serverID, userID, "politeSubSilenceTime", undefined)
        setUserVar(serverID, userID, "politeSubSilences", undefined)
    }
}

exports.tick = tick;