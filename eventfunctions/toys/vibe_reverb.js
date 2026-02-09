const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar, getUserVar } = require("../../functions/usercontext");

const initial_timespan = 180000
const timespan_inc = 15000
const decay_period = 30000

function msgfunction(userid, data) {

    // Catch Message, Update End Time and Increment Vibe Intensity    
    if(getUserVar(userid, "reverbEndTime") == undefined) {
        // Set initial 3 minute timer
        setUserVar(userid, "reverbEndTime", Date.now() + initial_timespan);
    } else {
        // Increment by 15s per Message
        setUserVar(userid, "reverbEndTime", getUserVar(userid, "reverbEndTime") + timespan_inc);
    }

    // Declare Initial Decay Time
    if(getUserVar(userid, "reverbDecayTime") == undefined) {
        setUserVar(userid, "reverbDecayTime", Date.now() + decay_period);
    }

    // Increment Intensity Modifier
    setUserVar(userid, "reverbVibeIntensity", Math.min(getUserVar(userid, "reverbVibeIntensity") + 1, 20));
    return;
}

async function functiontick(userID) {
    // Clear Values When Vibe Stops
    if (getUserVar(userID, "reverbEndTime") < Date.now() && getUserVar(userID, "reverbVibeIntensity") == 0) {
        console.log(`${userID}'s Reverb Vibe has stopped`)
        setUserVar(userID, "reverbEndTime", undefined)
        setUserVar(userID, "reverbDecayTime", undefined)
    }

    // Decay Intensity every Decay Period until 0
    if (getUserVar(userID, "reverbDecayTime") < Date.now() && getUserVar(userID, "reverbDecayTime") != undefined)
    {
        setUserVar(userID, "reverbVibeIntensity", Math.max(getUserVar(userID, "reverbVibeIntensity") - 1, 0));
        setUserVar(userID, "reverbDecayTime", Date.now() + decay_period);
    }
}

exports.functiontick = functiontick;
exports.msgfunction = msgfunction;