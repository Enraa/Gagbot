const { calcDenialCoefficient } = require("../../vibefunctions");
const { getArousal } = require("../arousal/getArousal");
const { getArousalBar } = require("../arousal/getArousalBar");
const { getArousalChangeDescription } = require("../arousal/getArousalChangeDescription");
const { getArousalDescription } = require("../arousal/getArousalDescription");
const { getHeavy } = require("../heavy/getHeavy");
const { getToys } = require("../toy/getToys");
const { getOption } = require("./getOption");
const { getUserVar } = require("./getUserVar");

/*************
 * Get the user's additional display texts, ordered and only viewable if necessary. 
 * 
 * - (user id) userID - User ID of the person viewing
 * - (user id) inspectuserID - User ID of the person we're checking
 * ---
 * ##### Returns a string to append to outfit modal with all of the additional widgets
 ************/
async function getDisplayTexts(userID, inspectuserID) {
    let bartext = ``;

    // ******************** Arousal Display
    if (getArousal(inspectuserID) > 2.0) {
        if (getOption(userID, "arousaldisplay") == "bar") {
            bartext = `\n\n💞 Arousal: ${getArousalBar(inspectuserID).bar} (${getArousalBar(inspectuserID).percentage}%)`
            if (calcDenialCoefficient(inspectuserID) > 1) {
                bartext = `${bartext}\n\n-# ‎ (Current Denial: **${Math.round(calcDenialCoefficient(inspectuserID) * 100)}%**)`
            }
        }
        if (getOption(userID, "arousaldisplay") == "desc") {
            let arousaltext = getArousalDescription(inspectuserID);
            let arousalchangetext = getArousalChangeDescription(inspectuserID)
            bartext = `\n\n💞 Arousal: **${arousaltext}**${arousalchangetext ? `\n-# **...${arousalchangetext}**` : ""}`
        }
        if (getOption(userID, "arousaldisplay") == "numbers") {
            bartext = `\n\n💞 Arousal: **${Math.round(getArousal(inspectuserID) * 10) / 10}** of **${Math.round(calcDenialCoefficient(inspectuserID) * 10)}** (${Math.round((getArousal(inspectuserID) / ((calcDenialCoefficient(inspectuserID) * 10))) * 100) / 1}%)`
        }
    }
    // ****************** 

    // ****************** People in lap
    let lappeople = [];
    // Attempt to get the current guild member object for the user. This might have unintended consequences
    // however I'd have to retool the main function to narrow down to one guild. Too much work currently. 
    let inspectusername = (process.client.guilds.cache.map(guild => guild.members.cache.get(inspectuserID)).find(m => m !== undefined))?.displayName;
    Object.keys(process.heavy).forEach((k) => {
        let lapped = false;
        if (!Array.isArray(process.heavy[k])) {
            console.log("Not an array")
            console.log(process.heavy[k])
        }
        else {
            process.heavy[k].forEach((h) => {
                // If its a lap and starts with the inspect user's name, then it's OURS
                if ((h.type === "dominants_lap") && (h.displayname.startsWith(inspectusername ?? "undefined"))) {
                    lappeople.push(k)
                }
            })
        }
    })
    if (lappeople.length > 0) {
        bartext = `${bartext}\n\n🫂 Subs in Lap: ${lappeople.map((m) => `<@${m}>`).join(", ")}`
    }
    // ****************** 

    // ****************** Shared Gasmask --- Can't currently test this because linked was disabled for now. 
    if (process.headwear && process.headwear[inspectuserID] && process.headwear[inspectuserID].sharedbreathhose) {
        bartext = `${bartext}\n\n${process.emojis.gasmask} Sharing Breath with: <@${process.headwear[inspectuserID].sharedbreathhose}>`
    } 
    // ****************** 

    // ****************** Headpat Battery
    if (getToys(inspectuserID).find((t) => t.type == "vibe_headpatbattery")) {
        bartext = `${bartext}\n\n🔋 Headpat Vibrator Battery: **${Math.round(getUserVar(inspectuserID, "headpatvibecharge") * 100)}%**`
    }
    // ******************

    // ****************** Headpat Battery
    if (getHeavy(inspectuserID, "windupclockwork")) {
        bartext = `${bartext}\n\n🕰️ Wind-up Key Tension: **${Math.round(getUserVar(inspectuserID, "windupcharge") * 100)}%**`
    }
    // ******************

    return bartext.slice(1); // Cut the first linebreak for better look
}

exports.getDisplayTexts = getDisplayTexts;