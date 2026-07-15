const { getChastity } = require("../getters/chastity/getChastity");
const { getChastityBra } = require("../getters/chastity/getChastityBra");
const { getChastityBraName } = require("../getters/chastity/getChastityBraName");
const { getChastityName } = require("../getters/chastity/getChastityName");
const { getCollar } = require("../getters/collar/getCollar");
const { getAllowedExtreme } = require("../getters/config/getAllowedExtreme");
const { getOption } = require("../getters/config/getOption");
const { getRecentChannel } = require("../getters/config/getRecentChannel");
const { getGag } = require("../getters/gag/getGag");
const { getBaseHeadwear } = require("../getters/headwear/getBaseHeadwear");
const { getHeadwear } = require("../getters/headwear/getHeadwear");
const { getHeadwearName } = require("../getters/headwear/getHeadwearName");
const { getBaseHeavy } = require("../getters/heavy/getBaseHeavy");
const { getHeavy } = require("../getters/heavy/getHeavy");
const { getMitten } = require("../getters/mitten/getMitten");
const { getMittenName } = require("../getters/mitten/getMittenName");
const { allEligibleToys } = require("../getters/toy/allEligibleToys");
const { getBaseToy } = require("../getters/toy/getBaseToy");
const { messageSendChannel } = require("../messagefunctions");
const { markForSave } = require("../other/markForSave");
const { traceFirstParam } = require("../other/TESTS/traceFirstParam");
const { assignChastity } = require("../setters/chastity/assignChastity");
const { assignChastityBra } = require("../setters/chastity/assignChastityBra");
const { assignHeadwear } = require("../setters/headwear/assignHeadwear");
const { assignHeavy } = require("../setters/heavy/assignHeavy");
const { assignMitten } = require("../setters/mitten/assignMitten");
const { removeMitten } = require("../setters/mitten/removeMitten");
const { assignToy } = require("../setters/toy/assignToy");
const { removeToy } = require("../setters/toy/removeToy");
const { getText } = require("../textfunctions");
const { userHasTags } = require("../getters/config/userHasTags");
const { getItemTags } = require("../getters/config/getItemTags");
const { setProcessVariable } = require("../setters/config/setProcessVariable");
const { getItemType } = require("../getters/config/getItemType");
const { getProcessVariable } = require("../getters/config/getProcessVariable");

/************
 * Attempts to perform an action on a user, if they are eligible. Actions are on a per restraint basis with a randomized cooldown based on config. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user whose keys are held by Gagbot
 ************/
async function rollGagbotKeyAction(serverID, userID, type) {
    traceFirstParam(arguments[0]);
    let heldkeys = process.heldkeytimers ?? {};
    if (getOption(serverID, userID, "gagbotheldkeyaction") == "disabled") { 
        // The user has disabled Gagbot held key actions, leave immediately
        return;
    }
    if (!getRecentChannel(serverID, userID).valid || (getRecentChannel(serverID, userID).messagetimestamp + 300000) < Date.now()) {
        // This user has not spoken recently. Ignore them for now. 
        return;
    }
    if (heldkeys[`${serverID}_${userID}_${type}`].lastaction == undefined) {
        // No timer to start with, so lets add some random time up to 5 minutes to the held key timer. 
        heldkeys[`${serverID}_${userID}_${type}`].lastaction = (Date.now() + Math.floor(Math.random() * 300000))
    }
    if ((process.recentgagbotaction ?? 0) > (Date.now())) {
        // Only allowed to perform up to one action per 15 seconds, globally
        return;
    }
    if (heldkeys[`${serverID}_${userID}_${type}`] && ((heldkeys[`${serverID}_${userID}_${type}`].lastaction ?? 0) < Date.now())) {
        let guild = process.client.guilds.cache.get(serverID);
        let interactionuser = await guild.members.me
        let targetuser = await guild.members.fetch(userID)
        if (type == "collar" && getCollar(serverID, userID)) {
            // Gagbot can choose to do either a chastity device, mittens, heavy bondage, or a mask
            let eligibletypes = [];
            ["mitten", "chastity", "heavy", "mask"].forEach((f) => {
                if (getCollar(serverID, userID)[f]) {
                    eligibletypes.push(f);
                }
            })
            let actiontotake = (eligibletypes.length > 0) ? eligibletypes[Math.floor(Math.random() * eligibletypes.length)] : "none"
            let data = {
                textdata: {
                    serverID: serverID,
                    interactionuser: interactionuser, // The Gagbot actor
                    targetuser: targetuser // The user wearing the restraint
                }
            }
            if (actiontotake == "none") { 
                // Their collar does not have any permissions. Oh well. 
                return 
            }
            // If the last action was NOT mittens, then we can do mittens again
            else if (actiontotake == "mitten" && (!getProcessVariable(serverID, userID, "recentgagbotactionitem") || (getItemType(getProcessVariable(serverID, userID, "recentgagbotactionitem")) != "mitten"))) {
                if (getMitten(serverID, userID)) {
                    // Remove their mittens!
                    data.textarray = "texts_unmitten"
                    data.textdata.c1 = getHeavy(serverID, userID)?.displayname // heavy bondage type
                    data.textdata.c2 = getMittenName(serverID, getMitten(serverID, userID)?.mittenname) ?? "mittens"
                    data.noheavy = true;
                    data.other = true;
                    if (getGag(serverID, userID)) {
                        data.gag = true;
                    }
                    else {
                        data.nogag = true;
                    }
                    messageSendChannel(getText(data), getRecentChannel(serverID, userID).messagechannelid)
                    removeMitten(serverID, userID);
                    heldkeys[`${serverID}_${userID}_${type}`].lastaction = (Date.now() + (Math.floor(getOption(serverID, userID, "gagbotheldkeyaction") * (0.5 + Math.random() * 0.5))))
                }
                else {
                    // Add some mittens!
                    data.textarray = "texts_mitten"
                    data.textdata.c1 = getHeavy(serverID, userID)?.displayname // heavy bondage type
                    data.nomitten = true;
                    data.other = true;
                    if (getGag(serverID, userID)) {
                        data.gag = true;
                    }
                    else {
                        data.nogag = true;
                    }

                    // Choose a random mitten, then validate if it's okay or not. 
                    let mittentypes = process.autocompletes.mitten.map((f) => f.value);
                    let chosenmitten = mittentypes[Math.floor(Math.random() * mittentypes.length)]
                    data.textdata.c2 = getMittenName(serverID, userID, chosenmitten) ?? "mittens"

                    // Now check if it's allowed with an extreme
                    if (getAllowedExtreme(serverID, interactionuser, targetuser, "mittens", chosenmitten) && !userHasTags(serverID, userID, getItemTags(chosenmitten, true))) {
                        messageSendChannel(getText(data), getRecentChannel(serverID, userID).messagechannelid)
                        assignMitten(serverID, userID, chosenmitten, interactionuser.id);
                        heldkeys[`${serverID}_${userID}_${type}`].lastaction = (Date.now() + (Math.floor(getOption(serverID, userID, "gagbotheldkeyaction") * (0.5 + Math.random() * 0.5))))
                        markForSave("heldkeytimers");
                        process.recentgagbotaction = (Date.now() + 15000)
                        setProcessVariable(serverID, userID, "recentgagbotactionitem", chosenmitten)
                    }
                }
            }
            else if (actiontotake == "chastity") {
                let coinflip = (Math.floor(Math.random() * 100) % 2); // 50% chance for belt or bra
                if (!getChastity(serverID, userID) && (coinflip == 0)) {
                    // Add a chastity belt!
                    data.textarray = "texts_chastity"
                    data.textdata.c1 = getHeavy(serverID, userID)?.displayname // heavy bondage type
                    data.textdata.c3 = `<@${getChastity(serverID, userID)?.keyholder}>`
                    data.other = true
                    data.chastitybelt = true;
                    data.noheavy = true;
                    data.nochastity = true;

                    // Choose a random chastity belt, then validate if it's okay or not. 
                    let chastitytypes = process.autocompletes.chastitybelt.map((f) => f.value);
                    let chosenchastity = chastitytypes[Math.floor(Math.random() * chastitytypes.length)]
                    data.textdata.c2 = getChastityName(serverID, userID, chosenchastity) ?? "chastity belt"

                    // Now check if it's allowed with an extreme
                    if (getAllowedExtreme(serverID, interactionuser, targetuser, "chastity", chosenchastity) && !userHasTags(serverID, userID, getItemTags(chosenchastity, true))) {
                        messageSendChannel(getText(data), getRecentChannel(serverID, userID).messagechannelid)
                        assignChastity(serverID, userID, interactionuser.id, chosenchastity);
                        heldkeys[`${serverID}_${userID}_${type}`].lastaction = (Date.now() + (Math.floor(getOption(serverID, userID, "gagbotheldkeyaction") * (0.5 + Math.random() * 0.5))))
                        markForSave("heldkeytimers");
                        process.recentgagbotaction = (Date.now() + 15000)
                        setProcessVariable(serverID, userID, "recentgagbotactionitem", chosenchastity)
                    }
                }
                else if (!getChastityBra(serverID, userID) && (coinflip == 1)) {
                    // Add a chastity bra!
                    data.textarray = "texts_chastity"
                    data.textdata.c1 = getHeavy(serverID, userID)?.displayname // heavy bondage type
                    data.textdata.c3 = `<@${getChastityBra(serverID, userID)?.keyholder}>`
                    data.other = true
                    data.chastitybra = true;
                    data.noheavy = true;
                    data.nochastity = true;

                    // Choose a random chastity belt, then validate if it's okay or not. 
                    let chastitytypes = process.autocompletes.chastitybra.map((f) => f.value);
                    let chosenchastity = chastitytypes[Math.floor(Math.random() * chastitytypes.length)]
                    data.textdata.c2 = getChastityBraName(serverID, userID, chosenchastity) ?? "chastity bra"

                    // Now check if it's allowed with an extreme
                    if (getAllowedExtreme(serverID, interactionuser, targetuser, "chastity", chosenchastity) && !userHasTags(serverID, userID, getItemTags(chosenchastity, true))) {
                        messageSendChannel(getText(data), getRecentChannel(serverID, userID).messagechannelid)
                        assignChastityBra(serverID, userID, interactionuser.id, chosenchastity);
                        heldkeys[`${serverID}_${userID}_${type}`].lastaction = (Date.now() + (Math.floor(getOption(serverID, userID, "gagbotheldkeyaction") * (0.5 + Math.random() * 0.5))))
                        markForSave("heldkeytimers");
                        process.recentgagbotaction = (Date.now() + 15000)
                        setProcessVariable(serverID, userID, "recentgagbotactionitem", chosenchastity)
                    }
                }
            }
            else if (actiontotake == "heavy") {
                // Add heavy bondage! It doesn't really matter which one, we're just gonna add one! 
                data.textarray = "texts_heavy"
                data.textdata.c1 = getHeavy(serverID, userID)?.displayname // heavy bondage type
                data.noheavy = true;
                data.other = true;
                data.canwear = true;

                // Choose a random heavy bondage, then validate if it's okay or not. 
                let heavytypes = process.autocompletes.heavy.map((f) => f.value);
                let chosenheavy = heavytypes[Math.floor(Math.random() * heavytypes.length)]

                data.textdata.c2 = getBaseHeavy(chosenheavy).name
                data.textdata.c3 = getBaseHeavy(chosenheavy).name

                if (getBaseHeavy(chosenheavy) && getBaseHeavy(chosenheavy).namefunction) {
                    // The interaction object it calls for is specifically asking for the guild. This is likely a bad idea!
                    data = await getBaseHeavy(chosenheavy).namefunction({ guild: guild }, data); 
                }

                if (getBaseHeavy(chosenheavy).heavytags) {
                    if (getBaseHeavy(chosenheavy).heavytags?.length == 0) {
                        data["furniture"] = true
                    }
                    else {
                        data[getBaseHeavy(chosenheavy).heavytags[0]] = true; // Categorize this by the FIRST tag. 
                    }
                }

                // Now check if it's allowed with an extreme and if we're not wearing it already
                if (getAllowedExtreme(serverID, interactionuser, targetuser, "heavy", chosenheavy) && !getHeavy(serverID, userID, chosenheavy) && !userHasTags(serverID, userID, getItemTags(chosenheavy, true))) {
                    messageSendChannel(getText(data), getRecentChannel(serverID, userID).messagechannelid)
                    assignHeavy(serverID, userID, chosenheavy, interactionuser.id, data.textdata.c3);
                    heldkeys[`${serverID}_${userID}_${type}`].lastaction = (Date.now() + (Math.floor(getOption(serverID, userID, "gagbotheldkeyaction") * (0.5 + Math.random() * 0.5))))
                    markForSave("heldkeytimers");
                    process.recentgagbotaction = (Date.now() + 15000)
                    setProcessVariable(serverID, userID, "recentgagbotactionitem", chosenheavy)
                }
            }
            else if (actiontotake == "mask") {
                // Add a mask!
                data.textarray = "texts_headwear"
                data.textdata.c1 = getHeavy(serverID, userID)?.displayname // heavy bondage type
                data.noheavy = true
                data.nomitten = true
                data.other = true
                data.noworn = true

                // Choose a random mask, then validate if it's okay or not. 
                let masktypes = process.autocompletes.headtypes.map((f) => f.value);
                let chosenmask = masktypes[Math.floor(Math.random() * masktypes.length)]

                data.textdata.c2 = getHeadwearName(serverID, userID, chosenmask)

                // Now check if it's allowed with an extreme and if we're not wearing it already. Also omit any lockable masks. 
                if (getAllowedExtreme(serverID, interactionuser, targetuser, "mask", chosenmask) && !getHeadwear(serverID, userID).includes(chosenmask) && !getBaseHeadwear(chosenmask).lockable && !userHasTags(serverID, userID, getItemTags(chosenmask, true))) {
                    messageSendChannel(getText(data), getRecentChannel(serverID, userID).messagechannelid)
                    assignHeadwear(serverID, userID, chosenmask, interactionuser.id);
                    heldkeys[`${serverID}_${userID}_${type}`].lastaction = (Date.now() + (Math.floor(getOption(serverID, userID, "gagbotheldkeyaction") * (0.5 + Math.random() * 0.5))))
                    markForSave("heldkeytimers");
                    process.recentgagbotaction = (Date.now() + 15000)
                    setProcessVariable(serverID, userID, "recentgagbotactionitem", chosenmask)
                }
            }
        }
        else if ((type == "chastity") || (type == "chastitybra")) {
            let coinflip = (Math.floor(Math.random() * 100) % 4); // 25% chance for removing, 75% adding
            let intensity = Math.min(1 + Math.floor(20 - (20 * (Math.random() * Math.random()))), 20) // 1-20, weighted higher towards higher numbers. 

            let eligibletoystoadd = allEligibleToys(serverID, userID, interactionuser.id);
            let eligibletoystoremove = allEligibleToys(serverID, userID, interactionuser.id, true);

            let data = {
                textdata: {
                    serverID: serverID,
                    interactionuser: interactionuser, // The Gagbot actor
                    targetuser: targetuser // The user wearing the restraint
                }
            }

            if ((coinflip != 0) && (eligibletoystoadd.length > 0)) {
                // Add a toy at some random intensity!
                let chosentoy = eligibletoystoadd[Math.floor(Math.random() * eligibletoystoadd.length)]

                // Dont use the same toy twice in a row.
                if (getProcessVariable(serverID, userID, "recentgagbotactionitem") == chosentoy) {
                    return;
                }

                data.textarray = "texts_toy",
                data.textdata.c1 = getHeavy(serverID, userID)?.displayname // heavy bondage type
                data.textdata.c2 = getBaseToy(chosentoy).toyname
                data.textdata.c3 = intensity

                data.noheavy = true;
                data.other = true;
                data.notoy = true; 
                if (getBaseToy(chosentoy).blocker({ serverID: serverID, userID: userID })) {
                    data.blocker = true;
                    data.access = true;
                    data[getBaseToy(chosentoy).category] = true;
                    data.nofumble = true;
                }
                else {
                    data.noblocker = true;
                    data[getBaseToy(chosentoy).category] = true;
                }
                messageSendChannel(getText(data), getRecentChannel(serverID, userID).messagechannelid)
                assignToy(serverID, userID, interactionuser.id, intensity, chosentoy, interactionuser.id);
                heldkeys[`${serverID}_${userID}_${type}`].lastaction = (Date.now() + (Math.floor(getOption(serverID, userID, "gagbotheldkeyaction") * (0.5 + Math.random() * 0.5))))
                markForSave("heldkeytimers");
                process.recentgagbotaction = (Date.now() + 15000)
                setProcessVariable(serverID, userID, "recentgagbotactionitem", chosentoy)
            }
            else if ((eligibletoystoremove.length > 0)) {
                // Remove a toy!
                let chosentoy = eligibletoystoremove[Math.floor(Math.random() * eligibletoystoremove.length)]

                // Dont use the same toy twice in a row.
                if (getProcessVariable(serverID, userID, "recentgagbotactionitem") == chosentoy) {
                    return;
                }

                data.textarray = "texts_untoy",
                data.textdata.c1 = getHeavy(serverID, userID)?.displayname // heavy bondage type
                data.textdata.c2 = getBaseToy(chosentoy)?.toyname
                data.textdata.c3 = intensity

                data.noheavy = true;
                data.other = true;
                data.toy = true; 
                if (getBaseToy(chosentoy).blocker({ serverID: serverID, userID: userID })) {
                    data.blocker = true;
                    data.access = true;
                    data[getBaseToy(chosentoy).category] = true;
                    data.nofumble = true;
                }
                else {
                    data.noblocker = true;
                    data[getBaseToy(chosentoy).category] = true;
                }
                messageSendChannel(getText(data), getRecentChannel(serverID, userID).messagechannelid)
                removeToy(serverID, userID, interactionuser.id, intensity, chosentoy, interactionuser.id);
                heldkeys[`${serverID}_${userID}_${type}`].lastaction = (Date.now() + (Math.floor(getOption(serverID, userID, "gagbotheldkeyaction") * (0.5 + Math.random() * 0.5))))
                markForSave("heldkeytimers");
                process.recentgagbotaction = (Date.now() + 15000)
                setProcessVariable(serverID, userID, "recentgagbotactionitem", chosentoy)
            }
        }
    }
}

exports.rollGagbotKeyAction = rollGagbotKeyAction;