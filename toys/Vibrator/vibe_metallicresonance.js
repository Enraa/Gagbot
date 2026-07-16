const { getChastity } = require("../../functions/getters/chastity/getChastity")
const { getItemTags } = require("../../functions/getters/config/getItemTags")

// Designed specifically for higher bonus against metallic chastity. For reasons. Has low bonus if NOT on chastity. 
exports.toyname = "Metallic Resonance Egg"

exports.vibescale = (data) => { return 1.8 }

exports.calcVibeEffect = function (data) { 
    if (getChastity(data.serverID, data.userID) && getItemTags(getChastity(data.serverID, data.userID)?.chastitytype, true)?.includes("metal")) {
        return data.intensity * (this.vibescale())
    }
    else {
        return data.intensity * (this.vibescale() * 0.08) // Very low effect if NOT in a metal chastity. 
    }
}

exports.itemdescription = `The **Metallic Resonance Egg** has a significantly reduced effect compared to other vibrators, but is amplified when placed inside a metallic chastity belt.`