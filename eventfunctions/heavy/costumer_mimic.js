const { getCollarName, getCollar, assignCollar } = require("../../functions/collarfunctions.js");
const { assignMitten, getMitten, getMittenName, getGag, convertGagText, assignGag } = require("../../functions/gagfunctions.js");
const { getHeadwear, DOLLVISORS, getHeadwearName, assignHeadwear } = require("../../functions/headwearfunctions.js");
const { removeHeavy, getHeavy, assignHeavy } = require("../../functions/heavyfunctions.js");
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
const maid_outfit = [
    { category: "wearable", itemtowear: "garters", color: "White" },
    { category: "wearable", itemtowear: "stockings", color: "White" },
    { category: "chastitybelt", itemtowear: "belt_maid", color: null },
    { category: "chastitybra", itemtowear: "bra_maid", color: null},
    { category: "mittens", itemtowear: "mittens_maid", color: null },
    { category: "wearable", itemtowear: "maid_dress", color: "Black" },
    { category: "wearable", itemtowear: "maid_apron", color: null },
    { category: "gag", itemtowear: "politeSub", color: null },
    { category: "collar", itemtowear: "collar_maid", color: null },
    { category: "headwear", itemtowear: "mask_kigu_cutemaid", color: null },
    { category: "wearable", itemtowear: "maid_headdress", color: null },
    { category: "heavy", itemtowear: "straitjacket_maid", color: null },
];

const ponygirl_outfit = [
    { category: "chastitybelt", itemtowear: "belt_silver", color: null },
    { category: "chastitybra", itemtowear: "bra_silver", color: null },
    { category: "collar", itemtowear: "collar_posture", color: null },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "wearable", itemtowear: "ponyboots_leather", color: "Red" },
    { category: "wearable", itemtowear: "ponytack_leather", color: "Red" },
    { category: "headwear", itemtowear: "blindfold_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "wearable", itemtowear: "headharness_leather", color: "Red" },
    { category: "wearable", itemtowear: "blinkers_leather", color: "Red" },
    { category: "heavy", itemtowear: "armbinder_leather", color: null },
];

const bunnygirl_outfit = [
    { category: "wearable", itemtowear: "outfit_playbunny_headwear", color: "Blue" },
    { category: "wearable", itemtowear: "bunnytights", color: "White" },
    { category: "wearable", itemtowear: "suit_outfit", color: "Playbunny" },
    { category: "wearable", itemtowear: "highheels", color: "Blue" },
    { category: "wearable", itemtowear: "cuffswrist_bondage", color: "Blue" },
    { category: "wearable", itemtowear: "cuffsankle_bondage", color: "Blue" },
    { category: "wearable", itemtowear: "cuffsthigh_bondage", color: "Blue" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "headwear", itemtowear: "mask_bunny", color: null },
    { category: "heavy", itemtowear: "armbinder_leather", color: null },
];

const princess_outfit = [
    { category: "wearable", itemtowear: "bra_lacy", color: "Pink" },
    { category: "wearable", itemtowear: "panties_lacy", color: "Pink" },
    { category: "wearable", itemtowear: "stockings", color: "White" },
    { category: "wearable", itemtowear: "gartersbelt", color: "White" },
    { category: "wearable", itemtowear: "princess_dress", color: "Pink" },
    { category: "wearable", itemtowear: "gloves_opera", color: "White" },
    { category: "wearable", itemtowear: "highheels", color: "Pink" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "headwear", itemtowear: "mask_kigu_🥰", color: null },
    { category: "wearable", itemtowear: "tiara", color: "Princess" },
    { category: "collar", itemtowear: "collar_princess", color: null },
    { category: "heavy", itemtowear: "dress_binding", color: null },
];

const lewd_princess_outfit = [
    { category: "wearable", itemtowear: "panties_lacy", color: "Black" },
    { category: "wearable", itemtowear: "stockings", color: "Black" },
    { category: "wearable", itemtowear: "gartersbelt", color: "Black" },
    { category: "wearable", itemtowear: "lingerie_royalicing", color: null },
    { category: "wearable", itemtowear: "necklace", color: "Silver" },
    { category: "wearable", itemtowear: "gloves_opera", color: "Black" },
    { category: "wearable", itemtowear: "highheels", color: "White" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "headwear", itemtowear: "mask_kigu_Yesh", color: null },
    { category: "wearable", itemtowear: "tiara", color: "Princess" },
    { category: "collar", itemtowear: "collar_princess", color: null },
    { category: "heavy", itemtowear: "boxbinder_leather", color: null },
];

const kitsune_outfit = [
    { category: "wearable", itemtowear: "lingerie", color: "Indigo" },
    { category: "wearable", itemtowear: "thighhighs", color: "White" },
    { category: "wearable", itemtowear: "kimono", color: "Indigo" },
    { category: "wearable", itemtowear: "sleeves_detatched", color: "Indigo" },
    { category: "wearable", itemtowear: "bigcute_ribbon", color: "White" },
    { category: "wearable", itemtowear: "sandals", color: null },
    { category: "wearable", itemtowear: "hairpins", color: "Jade" },
    { category: "wearable", itemtowear: "mask_kitsune", color: null },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "collar", itemtowear: "collar_runic", color: null },
    { category: "heavy", itemtowear: "ribbons", color: null },
];

const librarian_outfit = [
    { category: "wearable", itemtowear: "rope_karada", color: "Red" },
    { category: "wearable", itemtowear: "thighband_leather", color: "Brown" },
    { category: "wearable", itemtowear: "pencil_skirt", color: "Brown" },
    { category: "wearable", itemtowear: "buttonup_blouse", color: "White" },
    { category: "wearable", itemtowear: "ankleboots", color: "Brown" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "collar", itemtowear: "collar_posture", color: null },
    { category: "gag", itemtowear: "silent", color: null },
    { category: "headwear", itemtowear: "mask_kigu_shy", color: null },
    { category: "wearable", itemtowear: "glasses_librarian", color: null },
    { category: "wearable", itemtowear: "tome", color: "Tome of Bondage" },
    { category: "heavy", itemtowear: "straitjacket_comfy", color: null },
];

const rogue_outfit = [
    { category: "wearable", itemtowear: "panties_leather", color: "Gray" },
    { category: "wearable", itemtowear: "bra_leather", color: "Gray" },
    { category: "wearable", itemtowear: "gloves_fingerlesselbow", color: "Gray" },
    { category: "wearable", itemtowear: "bootyshorts_leather", color: "Black" },
    { category: "wearable", itemtowear: "top_crop_leather", color: "Black" },
    { category: "wearable", itemtowear: "thighhighboots", color: "Gray" },
    { category: "wearable", itemtowear: "bandolier_leather", color: null },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "silent", color: null },
    { category: "wearable", itemtowear: "roguemask_leather", color: "Gray" },
    { category: "collar", itemtowear: "collar_moon", color: null },
    { category: "wearable", itemtowear: "cloak", color: "Gray" },
    { category: "heavy", itemtowear: "straitjacket_comfy", color: null },
];

const dancer_outfit = [
    { category: "headwear", itemtowear: "blindfold_cloth", color: null },
    { category: "collar", itemtowear: "collar_moon", color: null },
    { category: "wearable", itemtowear: "armbands", color: "Gold" },
    { category: "wearable", itemtowear: "bracelets", color: "Gold" },
    { category: "wearable", itemtowear: "anklets", color: "Gold" },
    { category: "wearable", itemtowear: "necklace", color: "Gold" },
    { category: "wearable", itemtowear: "hairpins", color: "Gold" },
    { category: "wearable", itemtowear: "headchain", color: "Gold" },
    { category: "wearable", itemtowear: "haremsilks", color: "Cyan" },
    { category: "wearable", itemtowear: "sleeves_detatched", color: "Cyan" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "wearable", itemtowear: "veil", color: "Half-Face" },
    { category: "heavy", itemtowear: "displaystand", color: null },
];

const paladin_outfit = [
    { category: "wearable", itemtowear: "bodystocking", color: "Black" },
    { category: "wearable", itemtowear: "harness_leather", color: "Leather" },
    { category: "wearable", itemtowear: "greaves", color: "Steel" },
    { category: "wearable", itemtowear: "gauntlet", color: "Steel" },
    { category: "chastitybelt", itemtowear: "belt_tungsten", color: null },
    { category: "chastitybra", itemtowear: "bra_tungsten", color: null },
    { category: "wearable", itemtowear: "armour", color: "Holy Knight" },
    { category: "wearable", itemtowear: "circlet", color: "Platinum" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "collar", itemtowear: "collar_steel", color: null },
    { category: "heavy", itemtowear: "yoke", color: null },
];

const ranger_outfit = [
    { category: "wearable", itemtowear: "bra_lacy", color: "Green" },
    { category: "wearable", itemtowear: "panties_lacy", color: "Green" },
    { category: "wearable", itemtowear: "thighhighs", color: "Green" },
    { category: "wearable", itemtowear: "gloves_fingerlesselbow", color: "Green" },
    { category: "wearable", itemtowear: "bootyshorts_leather", color: "Brown" },
    { category: "wearable", itemtowear: "top_halter", color: "Green" },
    { category: "wearable", itemtowear: "kneehighboots", color: "Brown" },
    { category: "wearable", itemtowear: "armour", color: "Leather" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "silent", color: null },
    { category: "collar", itemtowear: "collar_leather", color: null },
    { category: "wearable", itemtowear: "cloak", color: "Green" },
    { category: "heavy", itemtowear: "rope_hogtie", color: null },
];

const healer_outfit = [
    { category: "headwear", itemtowear: "blindfold_cloth", color: null },
    { category: "collar", itemtowear: "collar_star", color: null },
    { category: "gag", itemtowear: "politeSub", color: null },
    { category: "wearable", itemtowear: "stockings", color: "White" },
    { category: "wearable", itemtowear: "gloves_opera", color: "White" },
    { category: "chastitybelt", itemtowear: "belt_ancient", color: null },
    { category: "chastitybra", itemtowear: "bra_ancient", color: null },
    { category: "wearable", itemtowear: "shrine_maiden", color: "White" },
    { category: "wearable", itemtowear: "bigcute_ribbon", color: "Red" },
    { category: "wearable", itemtowear: "headchain", color: "Starveiled" },
    { category: "wearable", itemtowear: "balletheels", color: "White" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "wearable", itemtowear: "staff", color: "Gohei" },
    { category: "wearable", itemtowear: "leash", color: "White" },
    { category: "heavy", itemtowear: "armbinder_ancient", color: null },
];

const witch_outfit = [
    { category: "headwear", itemtowear: "blindfold_blackout", color: null },
    { category: "wearable", itemtowear: "bra_lacy", color: "Purple" },
    { category: "wearable", itemtowear: "panties_lacy", color: "Purple" },
    { category: "wearable", itemtowear: "stockings", color: null },
    { category: "wearable", itemtowear: "gloves_opera", color: "Purple" },
    { category: "wearable", itemtowear: "flowy_dress", color: "Purple" },
    { category: "wearable", itemtowear: "witchhat_normal", color: "Purple" },
    { category: "wearable", itemtowear: "kneehighboots", color: "Black" },
    { category: "wearable", itemtowear: "tome", color: "Shadowy Tome" },
    { category: "mittens", itemtowear: "mittens_hardlight", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "collar", itemtowear: "collar_runic", color: null },
    { category: "heavy", itemtowear: "shadowhands", color: null },
];

const angel_outfit = [
    { category: "headwear", itemtowear: "blindfold_cloth", color: null },
    { category: "wearable", itemtowear: "halo", color: "Angelic" },
    { category: "wearable", itemtowear: "wings", color: "Angelic" },
    { category: "wearable", itemtowear: "wingbinders", color: "White" },
    { category: "wearable", itemtowear: "armbands", color: "Platinum" },
    { category: "wearable", itemtowear: "anklets", color: "Platinum" },
    { category: "wearable", itemtowear: "headchain", color: "Platinum" },
    { category: "chastitybelt", itemtowear: "belt_featherlight", color: null },
    { category: "chastitybra", itemtowear: "bra_featherlight", color: null },
    { category: "wearable", itemtowear: "nightie_sheer", color: "White" },
    { category: "wearable", itemtowear: "tome", color: "Angelic Tome" },
    { category: "mittens", itemtowear: "mittens_hardlight", color: null },
    { category: "gag", itemtowear: "politeSub", color: null },
    { category: "collar", itemtowear: "collar_star", color: null },
    { category: "wearable", itemtowear: "tome", color: "Angelic Tome" },
    { category: "wearable", itemtowear: "leash", color: "White" },
    { category: "heavy", itemtowear: "scavengersdaughter", color: null },
];

const mermaid_outfit = [
    { category: "wearable", itemtowear: "mermaid_latex", color: "Aqua" },
    { category: "wearable", itemtowear: "armbands", color: "Cobalt" },
    { category: "wearable", itemtowear: "headchain", color: "Crystal" },
    { category: "wearable", itemtowear: "bikini", color: "Skimpy" },
    { category: "wearable", itemtowear: "pareo", color: "Aqua" },
    { category: "mittens", itemtowear: "mittens_hardlight", color: null },
    { category: "collar", itemtowear: "collar_moon", color: null },
    { category: "gag", itemtowear: "silent", color: null },
    { category: "wearable", itemtowear: "staff", color: "Elemental Staff" },
    { category: "heavy", itemtowear: "armbinder_latex", color: null },
];


const mimicCostumes = {
    maid_outfit: maid_outfit,
    ponygirl_outfit: ponygirl_outfit,
    bunnygirl_outfit: bunnygirl_outfit,
    princess_outfit: princess_outfit,
    lewd_princess_outfit: lewd_princess_outfit,
    kitsune_outfit: kitsune_outfit,
    librarian_outfit: librarian_outfit,
    rogue_outfit: rogue_outfit,
    dancer_outfit: dancer_outfit,
    paladin_outfit: paladin_outfit,
    ranger_outfit: ranger_outfit,
    healer_outfit: healer_outfit,
    witch_outfit: witch_outfit,
    angel_outfit: angel_outfit,
    mermaid_outfit: mermaid_outfit,
};

// Costumer Mimic Event Function
// Rapidly strips the victim of all unprotected clothing and restraints
// Then it will slowly apply a random outfit and set of restraints!
// Then it will spit them out and apply a new heavy item at the end!

let functiontick = async (userID) => {
    if (process.userevents == undefined) { process.userevents = {} }
    if (process.userevents[userID] == undefined) { process.userevents[userID] = {} }
    if (process.userevents[userID].costumermimic == undefined) { process.userevents[userID].costumermimic = { stage: 0 } }
    if (process.userevents[userID].costumermimic.costumeidx == undefined) { process.userevents[userID].costumermimic.costumeidx = 0 }
    if (process.userevents[userID].costumermimic.origbinder == undefined) { process.userevents[userID].costumermimic.origbinder = getHeavy(userID).origbinder }

    // Randomly select an outfit from mimicCostumes.js
    if (process.userevents[userID].costumermimic.outfit == undefined) { process.userevents[userID].costumermimic.outfit = Object.keys(mimicCostumes)[Math.floor(Math.random() * Object.keys(mimicCostumes).length)]; }
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
        //process.userevents[userID].costumermimic.nextupdate = Date.now() + 5000; // Test Speed
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

    console.log(process.userevents[userID].costumermimic)

    // Select Item from Chosen Outfit based in index
    let nextitem = mimicCostumes[process.userevents[userID].costumermimic.outfit][process.userevents[userID].costumermimic.costumeidx];
    let itemtoequipcolored = null;

    data.heavy = true;
    data.costumer_mimic = true;

    if (process.userevents[userID].costumermimic.stage == 0) {
        if (currclothes.length > 0) {
            console.log(currclothes)
            console.log(getWearableName(undefined, currclothes[0]))
            // Fetch Wearable name and remove it 
            data.textdata.c1 = getWearableName(undefined, currclothes[0]);
            data.removeclothing = true;
            deleteWearable(userID, currclothes[0]);

            // Send a message saying it stripped something off the wearer <3
            messageSendChannel(getText(data), process.recentmessages[userID])
            return;
        }
        else {
            // Victim Stripped of all unprotected clothing, progress to next stage
            process.userevents[userID].costumermimic.stage = 1;
            data.donestripping = true;
            messageSendChannel(getText(data), process.recentmessages[userID])
            return;
        }
    }

    // Apply Outfit Items once stripped until last index of array is reached or a heavy item is found
    if (process.userevents[userID].costumermimic.stage == 1 && process.userevents[userID].costumermimic.costumeidx < mimicCostumes[process.userevents[userID].costumermimic.outfit].length && nextitem.category != "heavy") {

        data.applyingOutfit = true;
        switch (nextitem.category) {
            case "wearable":
                data.wearable = true;
                itemtoequipcolored = colourItem(nextitem.itemtowear, nextitem.color);
                if (itemtoequipcolored != null) {
                    data.textdata.c1 = getWearableName(undefined, itemtoequipcolored)
                    assignWearable(userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                else {
                    data.textdata.c1 = getWearableName(undefined, nextitem.itemtowear)
                    assignWearable(userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "headwear":
                if (!getHeadwear(userID) || (getHeadwear(userID) && (getHeadwear(userID).getHeadwearName != nextitem.itemtowear))) {
                    data.headwear = true;
                    data.textdata.c1 = getHeadwearName(undefined, nextitem.itemtowear), // headwear name

                        // Apply the headwear    
                        assignHeadwear(userID, nextitem.itemtowear, targetobject.id)

                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "gag":
                if (!getGag(userID) || (getGag(userID) && (getGag(userID).getGagName != nextitem.itemtowear))) {
                    data.gag = true;
                    data.textdata.c1 = convertGagText(nextitem.itemtowear), // gag name
                    // Apply the gag    
                    assignGag(userID, nextitem.itemtowear, Math.floor(Math.random() * 10) + 1, process.userevents[userID].costumermimic.origbinder)
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "mittens":
                if (!getMitten(userID) || (getMitten(userID) && (getMitten(userID).getMittenName != nextitem.itemtowear))) {
                    data.mitten = true;
                    if (getMitten(userID)) {
                        data.textdata.c1 = getMittenName(undefined, getMitten(userID).mittenname) ?? "mittens", // mitten name
                            data.textdata.c2 = getMittenName(undefined, nextitem.itemtowear), // new mitten name
                            assignMitten(userID, nextitem.itemtowear, getMitten(userID).origbinder)

                        data.replace = true;
                    }
                    else {
                        data.textdata.c1 = getMittenName(undefined, nextitem.itemtowear), // mitten name
                        assignMitten(userID, nextitem.itemtowear, process.userevents[userID].costumermimic.origbinder)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "chastitybelt":
                if (!getChastity(userID) || (getChastity(userID) && (getChastity(userID).getChastityName != nextitem.itemtowear))) {
                    data.chastitybelt = true;
                    if (getChastity(userID)) {
                        data.textdata.c1 = getChastityName(undefined, getChastity(userID).getChastityName) ?? "chastity belt", // chastity name
                            data.textdata.c2 = getChastityName(undefined, nextitem.itemtowear), // new chastity name

                            // Update Chastity Belt Name with new type
                            process.chastity[userID].chastitytype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityName(undefined, nextitem.itemtowear), // chastity name
                        assignChastity(userID, process.userevents[userID].costumermimic.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "chastitybra":
                if (!getChastityBra(userID) || (getChastityBra(userID) && (getChastityBra(userID).getChastityBraName != nextitem.itemtowear))) {
                    data.chastitybra = true;
                    if (getChastityBra(userID)) {
                        data.textdata.c1 = getChastityBraName(undefined, getChastityBra(userID).getChastityBraName) ?? "chastity bra", // chastity bra name
                            data.textdata.c2 = getChastityBraName(undefined, nextitem.itemtowear), // new chastity bra name

                            // Update Chastity Bra Name with new type
                            process.chastitybra[userID].chastitytype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityBraName(undefined, nextitem.itemtowear), // chastity bra name
                        assignChastityBra(userID, process.userevents[userID].costumermimic.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "collar":
                if (!getCollar(userID) || (getCollar(userID) && (getCollar(userID).getCollarName != nextitem.itemtowear))) {
                    data.collar = true;
                    if (getCollar(userID)) {
                        data.textdata.c1 = getCollarName(undefined, getCollar(userID).getCollarName) ?? "collar", // collar name
                            data.textdata.c2 = getCollarName(undefined, nextitem.itemtowear), // new collar name

                            // Update Collar Name with new type
                            process.collar[userID].collartype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getCollarName(undefined, nextitem.itemtowear), // collar name
                        assignCollar(userID, process.userevents[userID].costumermimic.origbinder, { }, false, nextitem.itemtowear)
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

    } else if (nextitem.category == "heavy" || process.userevents[userID].costumermimic.costumeidx >= mimicCostumes[process.userevents[userID].costumermimic.outfit].length) {
        // Final Stage - Remove Mimic Heavy and spit them out, then apply Outfit Heavy!
        // heavy item reached or end of outfit reached        

        // Remove Current Heavy (Mimic)
        removeHeavy(userID);
        data.spitout = true;

        // Apply New Heavy
        if (nextitem.itemtowear && nextitem.category == "heavy") {
            assignHeavy(userID, nextitem.itemtowear, process.userevents[userID].costumermimic.origbinder);
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
    if (color && getWearableName(undefined, `${itemtowear}_${color.toLowerCase()}`)) {
        return `${itemtowear}_${color.toLowerCase()}`;
    }
    else {
        return `${itemtowear}`
    }
}

exports.functiontick = functiontick;