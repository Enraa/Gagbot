const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { calcDenialCoefficient } = require("../../vibefunctions");
const { getArousal } = require("../arousal/getArousal");
const { getArousalBar } = require("../arousal/getArousalBar");
const { getArousalChangeDescription } = require("../arousal/getArousalChangeDescription");
const { getArousalDescription } = require("../arousal/getArousalDescription");
const { getHeavy } = require("../heavy/getHeavy");
const { getToys } = require("../toy/getToys");
const { getOption } = require("./getOption");
const { getProcessVariable } = require("./getProcessVariable");
const { getUserVar } = require("./getUserVar");

/*************
 * Get the user's additional display texts, ordered and only viewable if necessary. 
 * 
 * - (server ID) serverID - The server this interaction is run on
 * - (user id) userID - User ID of the person viewing
 * - (user id) inspectuserID - User ID of the person we're checking
 * ---
 * ##### Returns a string to append to outfit modal with all of the additional widgets
 ************/
async function getDisplayTexts(serverID, userID, inspectuserID) {
    traceFirstParam(arguments[0]);
    let bartext = ``;

    // ******************** Arousal Display
    if (getArousal(serverID, inspectuserID) > 2.0) {
        if (getOption(serverID, userID, "arousaldisplay") == "bar") {
            bartext = `\n\n💞 Arousal: ${getArousalBar(serverID, inspectuserID).bar} (${getArousalBar(serverID, inspectuserID).percentage}%)`
            if (calcDenialCoefficient(serverID, inspectuserID) > 1) {
                bartext = `${bartext}\n\n-# ‎ (Current Denial: **${Math.round(calcDenialCoefficient(serverID, inspectuserID) * 100)}%**)`
            }
        }
        if (getOption(serverID, userID, "arousaldisplay") == "desc") {
            let arousaltext = getArousalDescription(serverID, inspectuserID);
            let arousalchangetext = getArousalChangeDescription(serverID, inspectuserID)
            bartext = `\n\n💞 Arousal: **${arousaltext}**${arousalchangetext ? `\n-# **...${arousalchangetext}**` : ""}`
        }
        if (getOption(userID, "arousaldisplay") == "numbers") {
            bartext = `\n\n💞 Arousal: **${Math.round(getArousal(serverID, inspectuserID) * 10) / 10}** of **${Math.round(calcDenialCoefficient(serverID, inspectuserID) * 10)}** (${Math.round((getArousal(serverID, inspectuserID) / ((calcDenialCoefficient(serverID, inspectuserID) * 10))) * 100) / 1}%)`
        }
    }
    // ****************** 

    // ****************** People in lap
    let lappeople = [];
    // Attempt to get the current guild member object for the user. This might have unintended consequences
    // however I'd have to retool the main function to narrow down to one guild. Too much work currently. 
    let guild = process.client.guilds.cache.get(serverID);
    let inspectusername = guild.members.get(inspectuserID).displayname
    if (process.heavy && process.heavy[serverID]) {
        Object.keys(process.heavy[serverID]).forEach((k) => {
            if (!Array.isArray(process.heavy[serverID][k])) {
                console.log("Not an array")
                console.log(process.heavy[serverID][k])
            }
            else {
                process.heavy[serverID][k].forEach((h) => {
                    // If its a lap and starts with the inspect user's name, then it's OURS
                    if ((h.type === "dominants_lap") && (h.displayname.startsWith(inspectusername ?? "undefined"))) {
                        lappeople.push(k)
                    }
                })
            }
        })  
    }
    if (lappeople.length > 0) {
        bartext = `${bartext}\n\n🫂 Subs in Lap: ${lappeople.map((m) => `<@${m}>`).join(", ")}`
    }
    // ****************** 

    // ****************** Shared Gasmask --- Can't currently test this because linked was disabled for now. 
    if (getProcessVariable(serverID, inspectuserID, "headwear").sharedbreathhose) {
        bartext = `${bartext}\n\n${process.emojis.gasmask} Sharing Breath with: <@${getProcessVariable(serverID, inspectuserID, "headwear").sharedbreathhose}>`
    } 
    // ****************** 

    // ****************** Headpat Battery
    if (getToys(serverID, inspectuserID).find((t) => t.type == "vibe_headpatbattery")) {
        bartext = `${bartext}\n\n🔋 Headpat Vibrator Battery: **${Math.round(getUserVar(serverID, inspectuserID, "headpatvibecharge") * 100)}%**`
    }
    // ******************

    // ****************** Windup Clockwork
    if (getHeavy(serverID, inspectuserID, "windupclockwork")) {
        bartext = `${bartext}\n\n🕰️ Wind-up Key Tension: **${Math.round(getUserVar(serverID, inspectuserID, "windupcharge") * 100)}%**`
    }
    // ******************

    return bartext.slice(1); // Cut the first linebreak for better look
}

exports.getDisplayTexts = getDisplayTexts;