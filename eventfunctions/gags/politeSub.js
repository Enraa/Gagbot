const { getUserVar } = require("../../functions/getters/config/getUserVar")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { setUserVar } = require("../../functions/setters/config/setUserVar")

async function tick(serverID, userID, data) {
    // Remind them on the third infraction and reset
    if (getUserVar(serverID, userID, "politeSubSilences") > 2) {
        messageSendChannel(`<@${userID}> should speak with titles to people, such as "Miss," "Mxtress," "Sir," "-sama" and the like.`, process.recentmessages[serverID][userID])
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