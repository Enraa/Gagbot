const { DRONEVISORS, DOLLVISORS } = require("../../headwearfunctions");
const { getCollar } = require("../collar/getCollar");
const { getHeadwear } = require("../headwear/getHeadwear");
const { getOption } = require("./getOption");


/**********
 * Retrieves any alternate name for the user
 * 
 * - (guild member) user - The user wearing name modifying items
 * ---
 * ##### Returns a string, either modified or the user's display name
 **********/
function getAlternateName(user) {
    let outname = user.displayName // We're putting a member object in here
    // Handle pet collar name
    if ((getCollar(user.id)?.collartype == "collarengraved") || (getCollar(user.id) && getCollar(user.id).additionalcollars && getCollar(user.id).additionalcollars.includes("collarengraved"))) {
        if (getOption(user.id, "engravedcollarname") && getOption(user.id, "engravedcollarname").length > 0) {
            outname = getOption(user.id, "engravedcollarname");
        }
    }

    // Handle Doll Visor name
    if (getHeadwear(user.id).find((headwear) => DOLLVISORS.includes(headwear))) {
        let dollIDOverride = getOption(user.id, "dollvisorname");
        let dollmaker = getHeadwear(user.id).find((headwear) => headwear === "dollmaker_visor");
        // If dollIDOverride is not specified or the override is exactly a string of numbers...
        // Force Dollmaker's Visor wearers to get this generation function
        if (!dollIDOverride || (Number.isFinite(dollIDOverride) && dollIDOverride.length < 6) || dollmaker) {
            if (!dollIDOverride.search(new RegExp(/\\D/, "g"))) {
                // If the DollIDOverride is only a string of numbers 
                outname = `DOLL-${dollIDout}`;
            }
            else {
                outname = `DOLL-${user.id.slice(-4)}`
            }
        }
        else {
            outname = dollIDOverride;
        }
    }

    // Handle Drone Visor name
    if (getHeadwear(user.id).find((headwear) => DRONEVISORS.includes(headwear))) {
        outname = `⬡-Drone ${getOption(user.id, "dronevisorname")}`;
    }

    // Finally, if the outname is EXACTLY the same as the displayName we recieved, 
    // or the user's display name can be found in the modified name,
    // or the modified name can be found in the user's display name, return it
    if ((user.displayName.toLowerCase() == outname.toLowerCase()) || 
        (outname.toLowerCase().includes(user.displayName.toLowerCase())) ||
        (user.displayName.toLowerCase().includes(outname.toLowerCase()))) { return outname }

    // Otherwise, we need to append the user's display name as we can
    let additionalpart = ``;
    // If the length of the replacement name is less than 25, we can add some of the username...
    if (outname.length < 25) {
        let additionallength = 32 - outname.length; // max length of name
        if (additionallength - 3 > user.displayName.length) {
            additionalpart = ` (${user.displayName})`;
        } else {
            // Get the length of their name, minus 6 for additional characters to fit into ...
            let reducedname = user.displayName.slice(0, Math.min(additionallength - 6, user.displayName.length));
            additionalpart = ` (${reducedname}...)`;
        }
    }

    return `${outname}${additionalpart}`.slice(0,32)
}

exports.getAlternateName = getAlternateName;