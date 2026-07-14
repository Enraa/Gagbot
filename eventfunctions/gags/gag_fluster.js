const { getOption } = require("../../functions/getters/config/getOption");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { setUserVar } = require("../../functions/setters/config/setUserVar");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel.js");
const { messageSendChannel } = require("../../functions/messagefunctions")
const { convertPronounsText } = require("../../functions/other/convertPronounsText");

// Successful headpats will recharge the battery on the recipient's vibe by 5%. Each minute drains 2%. 
function headpatfunction(serverID, recipient, data) {
    if (data.returnedobject.hit) {
        if (!getUserVar(serverID, recipient, "fluster") && getRecentChannel(serverID, recipient).valid) {
            setTimeout(() => {
                messageSendChannel(convertPronounsText(`As USER_THEY USER_ISARE given the headpat, USER_TAG's cheeks flush a bright red and USER_THEY can't help but stammer!`, { serverID: serverID, interactionuser: { id: recipient }, targetuser: { id: recipient }}), getRecentChannel(serverID, recipient).channelid)
            }, 3000);
        }
        setUserVar(serverID, recipient, "fluster", Date.now() + (300000 * getOption(serverID, recipient, "headpatrestraintpotency")));
    }
}

// Update battery
async function tick(serverID, userid, data) {
    if (getUserVar(serverID, userid, "fluster") && (getUserVar(serverID, userid, "fluster") < Date.now())) {
        setUserVar(serverID, userid, "fluster", undefined);
    }
}

exports.tick = tick;
exports.headpatfunction = headpatfunction;