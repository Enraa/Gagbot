const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { clearArousal, getArousal, addArousal } = require("../../functions/vibefunctions")

let functiontick = async function(userid) {
    // Reset Wearer to initial state every 3 mins~        
    if(Date.now() > (getUserVar(userid, "stasis_timer") + 180000)){
        setUserVar(userid, "stasis_timer", Date.now())
        clearArousal(userid);
        addArousal(userid, getUserVar(userid, "base_arousal"));
    }
}

exports.functiontick = functiontick;