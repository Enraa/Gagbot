const { getUserVar } = require("../../functions/getters/config/getUserVar")
const { setUserVar } = require("../../functions/setters/config/setUserVar")
const { honorifictitles } = require("../../lists/politetitles");

// This vibrator will only function if getUserVar(userID, "politeSubVibeTime") has any value
exports.vibescale = (data) => { return 3.0 } // Not a mistake. Very arousing to be compliant!

exports.calcVibeEffect = function (data) { 
    return (getUserVar(data.serverID, data.userID, "politeSubVibeTime") ? data.intensity * this.vibescale() : 0)
}

exports.onUnequip = function (data) {
    setUserVar(data.serverID, data.userID, "politeSubVibeTime", null);
}

exports.onEquip = function (data) {
    setUserVar(data.serverID, data.userID, "politeSubVibeTime", null);
}

exports.toyname = "Polite Vibe"

exports.itemdescription = `The **Polite Vibe** will activate whenever the user uses an honorific title in their speech, providing a vibrating effect for a few minutes.\n\n**Permitted Honorific Titles:**\n${honorifictitles.join(", ")}`