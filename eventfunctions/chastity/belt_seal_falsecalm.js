const { getBotOption } = require("../../functions/getters/config/getBotOption");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { getBaseToy } = require("../../functions/getters/toy/getBaseToy");
const { getToys } = require("../../functions/getters/toy/getToys");
const { setUserVar } = require("../../functions/setters/config/setUserVar");


let tick = async function(serverID, userid, data) {
    //Tickrate Modifier
    let tickMod = (getBotOption("bot-timetickrate") / 60000)

    if(getToys(serverID, userid).length > 0)
    {            
        // Calc Impact of Toys and increment Base_Arousal
        getToys(serverID, userid).forEach(toy => {
            setUserVar(serverID, userid, "base_arousal", getUserVar(serverID, userid, "base_arousal") + (getBaseToy(serverID, toy.type).calcVibeEffect({ serverID: serverID, userID: userid, intensity: toy.intensity }) * tickMod))
        });
    }
    else 
    {
        // Slow Decrement of Arousal if no Toys
        setUserVar(serverID, userid, "base_arousal", Math.max(getUserVar(serverID, userid, "base_arousal") - tickMod, 0));
    }
}

exports.tick = tick;