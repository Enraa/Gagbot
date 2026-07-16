// Scalp Massager

const { getHeadwearRestrictions } = require("../../functions/getters/headwear/getHeadwearRestrictions")

// Provides a relaxing sensation but only if the wearer is not wearing a full head covering gear (canEmote)
exports.vibescale = (data) => { return 0.18 }

exports.calcVibeEffect = function (data) { 
    if (!getHeadwearRestrictions(data.serverID, data.userID).canEmote) {
        return (10 * (this.vibescale(data) * 0.40)) // 40% effectiveness if wearing covering headgear. 
    }
    else {
        return (10 * this.vibescale(data))
    }
}

exports.toyname = "Scalp Massager"

exports.itemdescription = `The **Scalp Massager** can be applied to anyone and will raise the user's arousal. Has a lowered effectiveness on users wearing any kind of headgear.`