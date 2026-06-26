const { getUserVar } = require("../../getters/config/getUserVar");
const { setRecentChannel } = require("../config/setRecentChannel");

/***********
 * Adds a reaction to the user's recent bell collar combo. Once the timer expires, then the next bot tick will clear it and emit a message to their recentmessages channel. 
 * 
 * - (react object) react - The raw reaction data received from messageReactionAdd
 * - (user object) user - The user doing the reaction
 * - (object) details - Additional detail like if it's a super react or not
 ***********/
function addBellCollarReact(react, user, details) {
    if (process.reactions == undefined) { process.reactions = {} };
    if (process.reactions[react.message.guildId] == undefined) { process.reactions[react.message.guildId] = {} }

    // If the user recently jingled, go away. 
    if (getUserVar(react.message.guildId, user.id, "reactbellcooldown") > Date.now()) { return }

    // jingle jingle jingle
    if (process.reactions[react.message.guildId][user.id]) {
        process.reactions[react.message.guildId][user.id].count++;
        process.reactions[react.message.guildId][user.id].comboend = (Date.now() + 7000);
    }
    else {
        process.reactions[react.message.guildId][user.id] = {
            count: 1,
            comboend: (Date.now() + 7000)
        }
    }
    setRecentChannel(react.message.guildId, user.id, react.message.channelId, "interaction")
}

exports.addBellCollarReact = addBellCollarReact;