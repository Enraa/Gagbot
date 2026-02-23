const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { getToys, getBaseToy } = require("../../functions/toyfunctions");
const { getBotOption } = require("../../functions/configfunctions.js");

let functiontick = async function(userid) {
    //Tickrate Modifier
    tickMod = (getBotOption("bot-timetickrate") / 60000)

    if(getToys(userid).length > 0)
    {            
        // Calc Impact of Toys and increment Base_Arousal
        getToys(userid).forEach(toy => {
            setUserVar(userid, "base_arousal", getUserVar(userid, "base_arousal") + (getBaseToy(toy.type).calcVibeEffect(toy) * tickMod))
        });
    }
    else 
    {
        // Slow Decrement of Arousal if no Toys
        setUserVar(userid, "base_arousal", Math.max(getUserVar(userid, "base_arousal") - tickMod, 0));
    }
}

exports.functiontick = functiontick;