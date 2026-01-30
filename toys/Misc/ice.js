const { getChastity, getArousal } = require("../../functions/vibefunctions")

// Ice 
// This reduces the arousal of the wearer by a proportion of their current arousal
exports.vibescale = (data) => { return (Math.max(Math.min(getArousal(data.userID) / 10, 10), 1) * -1) }
exports.calcVibeEffect = function (data) { 
    if (getChastity(data.userID)) {
        return data.intensity * 0.4 * (this.vibescale(data) * 0.40) // 40% effectiveness if in chastity
    }
    else {
        return data.intensity * 0.4 * this.vibescale(data)
    }
}

exports.toyname = "Ice"