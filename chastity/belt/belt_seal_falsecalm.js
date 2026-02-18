const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getToys, getBaseToy } = require("../../functions/toyfunctions");
const { getArousal, addArousal } = require("../../functions/vibefunctions")

// Seal of False Calm
// This Seal locks arousal at 0, while tracking what the strongest vibe they are wearing is and storing an arousal value relative to that every minute that is applied on being unequipped
// No Increase to denial when worn
exports.denialCoefficient = (data) => { return 1 }
// Arousal locked to 0
exports.maxArousal = (data) => { return 0 }

// Events
// Randomly reduce the level of arousal by a random percentage, then reduce by a further 10%
exports.onEquip = (data) => {
    // Configure base arousal value
    if (!getUserVar(data.userID, "base_arousal") || getUserVar(data.userID, "base_arousal") == undefined) setUserVar(data.userID, "base_arousal", getArousal(data.userID) ?? 0);
    if (!getUserVar(data.userID, "stasis_timer") || getUserVar(data.userID, "stasis_timer") == undefined) setUserVar(data.userID, "stasis_timer", Date.now());
}

exports.onUnequip = (data) => {
    //  Add All Stored Arousal at once
    addArousal(data.userID, getUserVar(data.userID, "base_arousal"));
    setUserVar(data.userID, "base_arousal", undefined);
    setUserVar(data.userID, "stasis_timer", undefined);
}

exports.afterArousalChange = (data) => {
    if(Date.now() > (getUserVar(data.userID, "stasis_timer") + 60000)){
        // Add one quarter of the highest vibe intensity as arousal to the base value, or reduce it by 1 with a floor of 0 if no vibe present~
        let vibeIntensity = 0;
        if(getToys(data.userID).length > 0)
        {
            vibeIntensity = getToys(data.userID).reduce((a,b)=>a.intensity>b.intensity?a:b).intensity ?? 0;
        }

        if(vibeIntensity > 0)
        {            
            setUserVar(data.userID, "base_arousal", getUserVar(data.userID, "base_arousal") + (vibeIntensity / 4));
        }
        else 
        {
            setUserVar(data.userID, "base_arousal", Math.max(getUserVar(data.userID, "base_arousal") - 1, 0));
        }
        setUserVar(data.userID, "stasis_timer", Date.now())
    }
}

// Tags
exports.tags = ["seal"]
// Name
exports.name = "Seal of False Calm"