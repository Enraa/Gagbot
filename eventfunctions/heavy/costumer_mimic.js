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
//const { mimicCostumes } = require('./mimic/mimicCostumes.js')

// File Containing Costumer Mimic Outfits - Wearables, Headwear, Mittens, Gags, Heavy. Only one Heavy item per outfit, and always at the end.
const maid_outfit = new Array([
    {category: "wearable", itemtowear: "maid_dress", color: "Black" },
    {category: "wearable", itemtowear: "maid_apron", color: "White" },
    {category: "wearable", itemtowear: "maid_headdress", color: null },
    {category: "wearable", itemtowear: "garters", color: "White" },
    {category: "wearable", itemtowear: "stockings", color: "White" },
    {category: "mittens", itemtowear: "mittens_maid", color: null },
    {category: "headwear", itemtowear: "mask_kigu_cutemaid", color: null },
    {category: "gag", itemtowear: "politesub", color: null },
    {category: "heavy", itemtowear: "straitjacket_maid", color: null },
]);

const ponygirl_outfit = new Array ([
    {category: "wearable", itemtowear: "ponyboots_leather", color: "Red" },
    {category: "wearable", itemtowear: "ponytack_leather", color: "Red" },
    {category: "wearable", itemtowear: "headharness_leather", color: "Red" },
    {category: "wearable", itemtowear: "blinkers_leather", color: "Red" },
    {category: "mittens", itemtowear: "mittens_leather", color: null },
    {category: "headwear", itemtowear: "blindfold_leather", color: null },
    {category: "gag", itemtowear: "ball", color: null },
    {category: "heavy", itemtowear: "armbinder_leather", color: null },
]);

const bunnygirl_outfit = new Array ([
    {category: "wearable", itemtowear: "outfit_playbunny_headwear", color: "Blue" },    
    {category: "wearable", itemtowear: "outfit_playbunny_collar", color: "White" },
    {category: "wearable", itemtowear: "suit_outfit", color: "Playbunny" },  // "
    {category: "wearable", itemtowear: "bunnytights", color: "White" },
    {category: "wearable", itemtowear: "highheels", color: "Blue" },
    {category: "wearable", itemtowear: "cuffswrist_bondage", color: "Blue" },
    {category: "wearable", itemtowear: "cuffsankle_bondage", color: "Blue" },
    {category: "wearable", itemtowear: "cuffsthigh_bondage", color: "Blue" },
    {category: "mittens", itemtowear: "mittens_leather", color: null },
    {category: "gag", itemtowear: "ball", color: null },
    {category: "headwear", itemtowear: "mask_bunny", color: null },
    {category: "heavy", itemtowear: "armbinder_leather", color: null },
]);


const mimicCostumes = [maid_outfit, ponygirl_outfit, bunnygirl_outfit];


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
    let currclothes = getWearable(userID).filter((f) => (!getLockedWearable(userID).includes(f))); // Current clothes that can be removed

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
    let itemtoequipcolored = null;

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
                if (itemtoequipcolored != null) {
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
                data.applyingrestraints = true;
                if (!getChastity(userID) || (getChastity(userID) && (getChastity(userID).getChastityName != nextitem.itemtowear))) {
                    data.chastitybelt = true;
                    if (getChastity(userID)) {
                        data.textdata.c1 = getChastityName(undefined, getChastity(userID).getChastityName), // chastity name
                            data.textdata.c2 = getChastityName(undefined, nextitem.itemtowear), // new chastity name

                            assignChastity(userID, nextitem.itemtowear, getChastity(userID).origbinder)

                        data.replace = true;
                    }
                    else {
                        assignChastity(userID, nextitem.itemtowear, targetobject.id)
                        data.textdata.c1 = getChastityName(undefined, nextitem.itemtowear), // chastity name

                            assignChastity(userID, nextitem.itemtowear, getChastity(userID).origbinder)

                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;
                
            case "chastitybra":
                data.applyingrestraints = true;
                if (!getChastityBra(userID) || (getChastityBra(userID) && (getChastityBra(userID).getChastityBraName != nextitem.itemtowear))) {
                    data.chastitybra = true;
                    if (getChastityBra(userID)) {
                        data.textdata.c1 = getChastityBraName(undefined, getChastityBra(userID).getChastityBraName), // chastity bra name
                            data.textdata.c2 = getChastityBraName(undefined, nextitem.itemtowear), // new chastity bra name

                            assignChastityBra(userID, nextitem.itemtowear, getChastityBra(userID).origbinder)

                        data.replace = true;
                    }
                    else {
                        assignChastityBra(userID, nextitem.itemtowear, targetobject.id)
                        data.textdata.c1 = getChastityBraName(undefined, nextitem.itemtowear), // chastity bra name

                            assignChastityBra(userID, nextitem.itemtowear, getChastityBra(userID).origbinder)

                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;
                
            case "collar":
                data.applyingrestraints = true;
                if (!getCollar(userID) || (getCollar(userID) && (getCollar(userID).getCollarName != nextitem.itemtowear))) {
                    data.collar = true;
                    if (getCollar(userID)) {
                        data.textdata.c1 = getCollarName(undefined, getCollar(userID).getCollarName), // collar name
                            data.textdata.c2 = getCollarName(undefined, nextitem.itemtowear), // new collar name

                            assignCollar(userID, nextitem.itemtowear, getCollar(userID).origbinder)

                        data.replace = true;
                    }
                    else {
                        assignCollar(userID, nextitem.itemtowear, targetobject.id)
                        data.textdata.c1 = getCollarName(undefined, nextitem.itemtowear), // collar name

                            assignCollar(userID, nextitem.itemtowear, getCollar(userID).origbinder)

                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
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
        // heavy item reached or end of outfit reached        
        
        // Remove Current Heavy (Mimic)
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