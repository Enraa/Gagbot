// Rising Vibes will modify their arousal gain over 2 minute intervals. 
// The effective output will be *double* the base rate,
// but will be modified 0-100% over that 2 minute span. This should achieve the same
// arousal gain over the period of time. 
// We will use performance.now() to calculate this as we do not need to know
// the exact timespan. 
exports.calcArousal = function (data) { return (data.intensity * this.vibescale * 2 * (1 / (performance.now % 120000)))}

exports.toyname = "Rising Vibe"