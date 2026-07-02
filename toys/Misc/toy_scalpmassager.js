// Scalp Massager

const { getHeadwearRestrictions } = require("../../functions/getters/headwear/getHeadwearRestrictions")

// Provides a relaxing sensation but only if the wearer is not wearing a full head covering gear (canEmote)
exports.vibescale = (data) => { return 0.35 }

exports.calcVibeEffect = function (data) { 
    if (!getHeadwearRestrictions(data.serverID, data.userID).canEmote) {
        return data.intensity * 0.4 * (this.vibescale(data) * 0.40) // 40% effectiveness if wearing covering headgear. 
    }
    else {
        return data.intensity * 0.4 * this.vibescale(data)
    }
}

exports.toyname = "Scalp Massager"