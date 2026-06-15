const { getHeadwearBlocks } = require("./getBaseHeadwear");
const { getHeadwear } = require("./getHeadwear");

/***********
 * Determine if a user is able to perform headwear blocking restrictions. 
 * 
 * - (user id) userID - The user wearing the headgear
 * ---
 * ##### Returns an object with the following properties:
 * - canEmote: The user is able to use emotes
 * - canInspect: The user is able to view details in /inspect
 ***********/
function getHeadwearRestrictions(userID) {
    let allowedperms = { canEmote: true, canInspect: true, forcedtextemoji: false };
    let wornheadwear = getHeadwear(userID);
    for (let i = 0; i < wornheadwear.length; i++) {
        if (getHeadwearBlocks(wornheadwear[i]) && getHeadwearBlocks(wornheadwear[i]).blockemote) {
            allowedperms.canEmote = false;
        }
        if (getHeadwearBlocks(wornheadwear[i]) && getHeadwearBlocks(wornheadwear[i]).blockinspect) {
            allowedperms.canInspect = false;
        }
        if (getHeadwearBlocks(wornheadwear[i]) && getHeadwearBlocks(wornheadwear[i]).forcedtextemoji) {
            allowedperms.forcedtextemoji = true;
        }
    }

    return allowedperms;
}

exports.getHeadwearRestrictions = getHeadwearRestrictions;