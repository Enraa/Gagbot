const { getBotOption } = require("../../functions/getters/config/getBotOption");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { getBaseToy } = require("../../functions/getters/toy/getBaseToy");
const { getToys } = require("../../functions/getters/toy/getToys");
const { setUserVar } = require("../../functions/setters/config/setUserVar");


let tick = async function(userid, data) {
    //Tickrate Modifier
    let tickMod = (getBotOption("bot-timetickrate") / 60000)

    if(getToys(userid).length > 0)
    {            
        // Calc Impact of Toys and increment Base_Arousal
        getToys(userid).forEach(toy => {
            setUserVar(userid, "base_arousal", getUserVar(userid, "base_arousal") + (getBaseToy(toy.type).calcVibeEffect({ userID: userid, intensity: toy.intensity }) * tickMod))
        });
    }
    else 
    {
        // Slow Decrement of Arousal if no Toys
        setUserVar(userid, "base_arousal", Math.max(getUserVar(userid, "base_arousal") - tickMod, 0));
    }
}

exports.tick = tick;