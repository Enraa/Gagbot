// This wand will provide higher effect the longer the delta between now and when the user put on the chastity belt. 
// Uses frustration mult to calculate this
const { getChastity } = require("../../functions/getters/chastity/getChastity")
const { getOption } = require("../../functions/getters/config/getOption")

// Designed specifically for higher bonus against long term chastity. For reasons. Has low bonus if NOT in chastity. 
exports.toyname = "Wand of Desperation"

exports.vibescale = (data) => { return 0.4 }

exports.calcVibeEffect = function (data) { 
    if (getChastity(data.serverID, data.userID)) {
        // Can be 0, 1, 2, 4, all the way up to 20x. This makes this do the full function at 1 full day if 20x.
        let frustrationmult = getOption(serverID, user, "frustration");
        if (frustrationmult == 0) {
            frustrationmult = 1;
        }
        let now = Date.now();
	    let hoursBelted = ((now - getChastity(data.serverID, data.userID).timestamp) / (60 * 60 * 1000)) * frustrationmult;
        
        // Now multiply vibescale by up to 10x across 500 hours belted. Divide the hoursBelted by 50. 
        return data.intensity * (this.vibescale() * Math.min((hoursBelted / 50), 10.0))
    }
    else {
        return data.intensity * (this.vibescale()) // Regular effect if NOT in chastity.
    }
}