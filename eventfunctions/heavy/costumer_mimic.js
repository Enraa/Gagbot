const { getCollarName, getCollar, assignCollar } = require("../../functions/collarfunctions.js");
const { assignMitten, getMitten, getMittenName, getGag } = require("../../functions/gagfunctions.js");
const { getHeadwear, DOLLVISORS, getHeadwearName, assignHeadwear } = require("../../functions/headwearfunctions.js");
const { removeHeavy, getHeavy } = require("../../functions/heavyfunctions.js");
const { messageSendChannel } = require("../../functions/messagefunctions.js");
const { getText } = require("../../functions/textfunctions.js");
const { getChastityBra } = require("../../functions/vibefunctions.js");
const { assignChastityBra } = require("../../functions/vibefunctions.js");
const { getChastityBraName } = require("../../functions/vibefunctions.js");
const { getChastityName, assignChastity } = require("../../functions/vibefunctions.js");
const { getChastity } = require("../../functions/vibefunctions.js");
const { getWearable, getLockedWearable, deleteWearable, getWearableName, assignWearable } = require("../../functions/wearablefunctions.js");
const { mimicCostumes } = require('./mimic/mimicCostumes.js')

// Costumer Mimic Event Function
// Rapidly strips the victim of all unprotected clothing and restraints
// Then it will slowly apply a random outfit and set of restraints!
// Then it will spit them out and apply a new heavy item at the end!

let functiontick = async (userID) => {
    if (process.userevents == undefined) { process.userevents = {} }
    if (process.userevents[userID] == undefined) { process.userevents[userID] = {} }
    if (process.userevents[userID].costumermimic == undefined) { process.userevents[userID].costumermimic = { stage: 0 } }
    if (process.userevents[userID].costumermimic.costumeidx == undefined) { process.userevents[userID].costumermimic.costumeidx = 0 }
    // Randomly select an outfit from mimicCostumes.js
    if (process.userevents[userID].costumermimic.outfit == undefined) { process.userevents[userID].costumermimic.outfit = mimicCostumes[Math.floor(Math.random() * mimicCostumes.length)]; }
    let currclothes = getWearable(userID).filter((f) => (!getLockedWearable(userID).includes(f)/* && (f !== "catsuit_latex")*/));

    // get the user object, if it doesn't exist, go away
    let userobject = await process.client.users.fetch(userID); // The person in the processing terminal!
    let targetobject = await process.client.users.fetch(getHeavy(userID).origbinder ?? userID); // The cruel person who threw this person in the terminal!
    // Something's wrong. 
    if (!userobject || !targetobject || !(process.recentmessages && process.recentmessages[userID])) {
        return;
    }

    // Only update a max of once every 20 seconds. 
    if ((process.userevents[userID].costumermimic.nextupdate ?? 0) < Date.now()) {
        process.userevents[userID].costumermimic.nextupdate = Date.now() + 20000;
    }
    else { return };

    // Build data tree:
    let data = {
        textarray: "texts_eventfunctions",
        textdata: {
            interactionuser: userobject,
            targetuser: targetobject,
        }
    }

    // Select Item from Chosen Outfit based in index
    let nextitem = mimicCostumes[process.userevents[userID].costumermimic.outfit[process.userevents[userID].costumermimic.costumeidx]];
    let itemtoequipcolored = "";

    data.heavy = true;
    data.costumemimic = true;

    if (process.userevents[userID].costumermimic.stage == 0 && (currclothes.length > 0)) {
        // Fetch Wearable name and remove it 
        data.textdata.c1 = getWearableName(undefined, currclothes[0]);
        data.removeclothing = true;
        deleteWearable(userID, currclothes[0]);

        // Send a message saying it stripped something off the wearer <3
        messageSendChannel(getText(data), process.recentmessages[userID])

    } else {
        // Victim Stripped of all unprotected clothing, progress to next stage
        process.userevents[userID].costumermimic.stage = 1;
        data.donestripping = true;
        messageSendChannel(getText(data), process.recentmessages[userID])
    }

    // Apply Outfit Items once stripped until last index of array is reached or a heavy item is found
    if (process.userevents[userID].costumermimic.stage == 1 && process.userevents[userID].costumermimic.costumeidx < process.userevents[userID].costumermimic.outfit.length && nextitem.category != "heavy") {

        data.applyingOutfit = true;
        switch (nextitem.category) {
            case "wearable":
                data.wearable = true;
                itemtoequipcolored = colourItem(nextitem.itemtowear, nextitem.color);
                if (itemtoequipcolored) {
                    assignWearable(userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "headwear":
                data.applyingrestraints = true;
                if (!getHeadwear(userID) || (getHeadwear(userID) && (getHeadwear(userID).getHeadwearName != nextitem.itemtowear))) {
                    data.headwear = true;
                    data.textdata.c1 = getHeadwearName(undefined, nextitem.itemtowear), // headwear name

                        // Apply the headwear    
                        assignHeadwear(userID, nextitem.itemtowear, targetobject.id)

                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                    process.userevents[userID].costumermimic.costumeidx++;
                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "gag":
                data.applyingrestraints = true;
                if (!getGag(userID) || (getGag(userID) && (getGag(userID).getGagName != nextitem.itemtowear))) {
                    data.gag = true;
                    data.textdata.c1 = getGagName(undefined, nextitem.itemtowear), // gag name

                        // Apply the gag    
                        assignGag(userID, nextitem.itemtowear, targetobject.id)

                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "mittens":
                data.applyingrestraints = true;
                if (!getMitten(userID) || (getMitten(userID) && (getMitten(userID).getMittenName != nextitem.itemtowear))) {
                    data.mitten = true;
                    if (getMitten(userID)) {
                        data.textdata.c1 = getMittenName(undefined, getMitten(userID).getMittenName), // mitten name
                        data.textdata.c2 = getMittenName(undefined, nextitem.itemtowear), // new mitten name

                            assignMitten(userID, nextitem.itemtowear, getMitten(userID).origbinder)

                        data.replace = true;
                    }
                    else {
                        assignMitten(userID, nextitem.itemtowear, targetobject.id)
                        data.textdata.c1 = getMittenName(undefined, nextitem.itemtowear), // mitten name

                            assignMitten(userID, nextitem.itemtowear, getMitten(userID).origbinder)

                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "chastitybelt":

            break;

            case "chastitybra":

            break;

            case "collar":

            break;

            default:
                // Unknown Item Category in Outfit
                data.unknown = true;
                data.textdata.c1 = nextitem.itemtowear; // item name
                messageSendChannel(getText(data), process.recentmessages[userID]);

                // Increment Costume Index to bypass unknown item
                process.userevents[userID].costumermimic.costumeidx++;
                break;
        }

    } else if (nextitem.category == "heavy" || process.userevents[userID].costumermimic.costumeidx >= process.userevents[userID].costumermimic.outfit.length) {
        // Final Stage - Remove Mimic Heavy and spit them out, then apply Outfit Heavy!
        removeHeavy(userID);
        data.spitout = true;

        // Apply New Heavy
        if (nextitem.itemtowear && nextitem.category == "heavy") {
            assignHeavy(userID, nextitem.itemtowear, null);
            data.textdata.c1 = getHeavy(userID).type; // heavy name
            data.add = true;
            messageSendChannel(getText(data), process.recentmessages[userID]);
        } else {
            data.none = true;
            messageSendChannel(getText(data), process.recentmessages[userID]);
        }

        // Remove Event and exit (Does this automatically go to Garbage Collector?)
        delete process.userevents[userID].costumermimic;
    }
}

const colourItem = (itemtowear, color) => {
    if (color) {
        return `${itemtowear}${color ? ("_" + color) : ""}`;
    }
}

exports.functiontick = functiontick;