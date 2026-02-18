const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getToys, getBaseToy } = require("../../functions/toyfunctions");

let functiontick = async function(userid) {
    // Update every minute
    if(Date.now() > (getUserVar(userid, "stasis_timer") + 60000)){
        // Add one quarter of the highest vibe intensity as arousal to the base value, or reduce it by 1 with a floor of 0 if no vibe present~
        let vibeIntensity = 0;
        if(getToys(userid).length > 0)
        {
            vibeIntensity = getToys(userid).reduce((a,b)=>a.intensity>b.intensity?a:b).intensity ?? 0;
        }

        if(vibeIntensity > 0)
        {            
            setUserVar(userid, "base_arousal", getUserVar(userid, "base_arousal") + (vibeIntensity / 4));
        }
        else 
        {
            setUserVar(userid, "base_arousal", Math.max(getUserVar(userid, "base_arousal") - 1, 0));
        }
        setUserVar(userid, "stasis_timer", Date.now())
    }
}

exports.functiontick = functiontick;