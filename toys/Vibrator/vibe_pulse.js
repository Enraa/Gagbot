// Pulsing Vibes will alternate between applying their effects every 30 seconds. 
// Like with rising vibes, it will multiply the incoming rate by 2 to ensure same
// effective result as bullet. 
exports.calcArousal = function (data) { return (data.intensity * this.vibescale * 2 * (((performance.now % 60000) < 30000) ? 1 : 0))}

exports.toyname = "Pulse Vibe"