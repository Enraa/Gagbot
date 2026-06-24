const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar } = require("../../functions/setters/config/setUserVar");

const initial_timespan = 180000
const timespan_inc = 15000
const decay_period = 30000

const newline = new RegExp(/[^\r\n]+/g)
const OOC = new RegExp(/^[*][^*].*[^*][*]$/)
const LOUD = new RegExp(/(\b[A-Z]['A-Z]+|\b[A-Z]\b)/)
const BOLD = new RegExp(/([\*][\*])/)

function msgfunction(serverID, userid, data) {

    // Catch Message, and Check for OOC, Whispers, or Shouting
    let intensity = volumetest(data.msgcontent)
    //console.log(intensity);

    // Escape if purely OOC message
    if (intensity == 0) return;

    //Update End Time and Increment Vibe Intensity    
    if(getUserVar(serverID, userid, "reverbEndTime") == undefined) {
        // Set initial 3 minute timer
        setUserVar(serverID, userid, "reverbEndTime", Date.now() + initial_timespan);
    } else {
        // Increment reverbEndTime by 15s x intensity per Message 
        setUserVar(serverID, userid, "reverbEndTime", getUserVar(serverID, userid, "reverbEndTime") + (timespan_inc * intensity));
    }

    // Declare Initial reverbDecayTime
    if(getUserVar(serverID, userid, "reverbDecayTime") == undefined) {
        setUserVar(serverID, userid, "reverbDecayTime", Date.now() + (decay_period * intensity));
    }
    else
    {
        // Override Next Decay time with a new value based on the intensity if it is longer than the current delay
        setUserVar(serverID, userid, "reverbDecayTime", Math.max(Date.now() + (decay_period * intensity), getUserVar(serverID, userid, "reverbDecayTime")));
    }

    // Increment reverbVibeIntensity based on intensity of message text
    setUserVar(serverID, userid, "reverbVibeIntensity", Math.min(getUserVar(serverID, userid, "reverbVibeIntensity") + (1 * intensity), 20));
    return;
}

async function tick(serverID, userID) {
    // Decay Intensity every Decay Period until 0
    if (getUserVar(serverID, userID, "reverbDecayTime") < Date.now() && getUserVar(serverID, userID, "reverbDecayTime") != undefined)
    {
        setUserVar(serverID, userID, "reverbVibeIntensity", Math.max(getUserVar(serverID, userID, "reverbVibeIntensity") - 1, 0));
        setUserVar(serverID, userID, "reverbDecayTime", Date.now() + decay_period);
    }

    // Clear Values When Vibe Stops
    if (getUserVar(serverID, userID, "reverbEndTime") < Date.now() && getUserVar(serverID, userID, "reverbVibeIntensity") == 0) {
        console.log(`${userID}'s Reverb Vibe has stopped`)
        setUserVar(serverID, userID, "reverbEndTime", undefined)
        setUserVar(serverID, userID, "reverbDecayTime", undefined)
    }
}

function volumetest(message) {
    // Split into lines
    let arrayOfLines = message.match(newline);
    //console.log(`ARRAY OF LINES: ${arrayOfLines}\n`);

    let intensityMod = 0;
    // Discard OOC Lines
    arrayOfLines.forEach((line) => {

        // Check for Whispers
        let Whisper = false;    
        if(line.startsWith("-#"))
        {            
            Whisper = true;
            line = line.replace("-# ", "");
        }

        // Ignore OOC Lines
        if(OOC.test(line))
        {
            //console.log(`OOC: ${line} : ${Whisper}`);
        }
        else if(!Whisper && LOUD.test(line) && (line.match(BOLD) || []).length >= 2)
        {
            //console.log(`BRIAN: ${line} : ${Whisper}`);
            return intensityMod = 4;
        }
        else if(!Whisper && LOUD.test(line)){
            if(intensityMod < 3) intensityMod = 3;
            //console.log(`LOUD: ${line} : ${Whisper}`);
        }                
        else if(!Whisper && (line.match(BOLD) || []).length >= 2)
        {               
            if(intensityMod < 2) intensityMod = 2;
            //console.log(`BOLD : ${line} : ${Whisper}`);
        }
        else if(Whisper && (line.match(BOLD) || []).length >= 2)
        {
            if(intensityMod < 0.75) intensityMod = 0.75;
            //console.log(`BOLD Whisper: ${line} : ${Whisper}`);
        }
        else if(Whisper)
        {
            if(intensityMod < 0.5) intensityMod = 0.5;
            //console.log(`Whisper: ${line} : ${Whisper}`);
        }
        else
        {
            if(intensityMod < 1) intensityMod = 1;
            //console.log(`Normal: ${line} : ${Whisper}`);
        }
    });
    return intensityMod;
}

exports.tick = tick;
exports.msgfunction = msgfunction;