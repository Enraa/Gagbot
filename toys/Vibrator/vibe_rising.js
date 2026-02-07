// Rising Vibes will modify their arousal gain over 5 minute intervals. 
// The effective output will be *triple* the base rate,
// but will be modified 0-100% over that 5 minute span. This should achieve the same
// arousal gain over the period of time. 
// We will use performance.now() to calculate this as we do not need to know
// the exact timespan. 
exports.calcVibeEffect = function (data) { 
    return (data.intensity * this.vibescale() * 3.0 * ((performance.now() % 300000) / 300000))
}

exports.toyname = "Rising Vibe"