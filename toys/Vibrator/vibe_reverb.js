const { getUserVar, setUserVar } = require("../../functions/usercontext")

// This vibrator will only function if getUserVar(userID, "reverbEndTime") has any value
exports.vibescale = (data) => { 
    //console.log(`${data.userID}`)
    //console.log(`${getUserVar(data.userID, "reverbVibeIntensity")/10}`);
    return (isNaN(Math.max(0, Math.min(getUserVar(data.userID, "reverbVibeIntensity")/10, 2))) ? 0 : Math.max(0, Math.min(getUserVar(data.userID, "reverbVibeIntensity")/10, 2)));
} // Ranging between 0 and 2

exports.calcVibeEffect = function(data) { 
    //console.log(`${data.userID}`)
    return (getUserVar(data.userID, "reverbEndTime") ? data.intensity * this.vibescale(data) : 0)
}

exports.onUnequip = (data) => {
    setUserVar(data.userID, "reverbEndTime", undefined);
    setUserVar(data.userID, "reverbDecayTime", undefined);
    setUserVar(data.userID, "reverbVibeIntensity", 0);
}

exports.onEquip = (data) => {
    setUserVar(data.userID, "reverbEndTime", undefined);
    setUserVar(data.userID, "reverbDecayTime", undefined);
    setUserVar(data.userID, "reverbVibeIntensity", 0);
}

exports.toyname = "Reverb Vibe"