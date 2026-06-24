const { getOption } = require("../../functions/getters/config/getOption");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { setUserVar } = require("../../functions/setters/config/setUserVar");

// Successful headpats will recharge the battery on the recipient's vibe by 5%. Each minute drains 2%. 
function headpatfunction(serverID, recipient, data) {
    if (data.returnedobject.hit) {
        setUserVar(serverID, recipient, "headpatslutgag", Date.now() + (300000 * getOption(serverID, recipient, "headpatrestraintpotency")));
    }
}

// Update battery
async function tick(serverID, userid, data) {
    if (getUserVar(serverID, userid, "headpatslutgag") && (getUserVar(serverID, userid, "headpatslutgag") < Date.now())) {
        setUserVar(serverID, userid, "headpatslutgag", undefined);
    }
}

exports.tick = tick;
exports.headpatfunction = headpatfunction;