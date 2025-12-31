const fs = require('fs');
const path = require('path');

const headweartypes = [
    { name: "Latex Hood", value: "hood_latex", },
    { name: "Leather Hood", value: "hood_leather", },
    { name: "Maid Hood", value: "hood_maid", },
    { name: "Leather Blindfold", value: "blindfold_leather", blockinspect: true },
    { name: "Blackout Lenses", value: "blindfold_blackout", blockinspect: true },
    { name: "Cloth Blindfold", value: "blindfold_cloth", blockinspect: true },
    { name: "High-Security Blindfold", value: "blindfold_highsec", blockinspect: true },
    { name: "Latex Blindfold", value: "blindfold_latex", blockinspect: true },
    { name: "Sleep Mask", value: "blindfold_sleep", blockinspect: true },
    { name: "Leather Head Harness", value: "headharness_leather" },
    { name: "Latex Hood (no eyes)", value: "hood_latexfull", blockinspect: true, blockemote: true },
    { name: "Hardlight Hood", value: "hood_hardlight", },
    { name: "Hardlight Hood (no eyes)", value: "hood_hardlightfull", blockinspect: true, blockemote: true },
    { name: "Kigu Mask (😀)", value: "mask_kigu_😀", blockinspect: true, blockemote: true, replaceemote: "😀" },
    { name: "Kigu Mask (🥰)", value: "mask_kigu_🥰", blockinspect: true, blockemote: true, replaceemote: "🥰" },
    { name: "Kigu Mask (Yesh)", value: "mask_kigu_Yesh", blockinspect: true, blockemote: true, replaceemote: "<:Yesh:1448775211838341251>" },
    { name: "Kigu Mask (Sadistic Maid)", value: "mask_kigu_sadisticmaid", blockinspect: true, blockemote: true, replaceemote: "<:sadisticmaid:1244055266815774730>" },
    { name: "Kigu Mask (Cute Maid)", value: "mask_kigu_cutemaid", blockinspect: true, blockemote: true, replaceemote: "<:cutemaid:1244055369169502209>" },
    { name: "Kigu Mask (Happy Maid)", value: "mask_kigu_happymaid", blockinspect: true, blockemote: true, replaceemote: "<:happymaid:1244055447900655666>" },
    { name: "Kigu Mask (Cursed Epicenter)", value: "mask_kigu_epicenter", blockinspect: true, blockemote: true, replaceemote: "<:EpicenterCursed:1167683745428549632>" },
    { name: "Sheep Mask", value: "mask_sheep", blockinspect: true, blockemote: true, replaceemote: "🐑" },
    { name: "Kitty Mask", value: "mask_kitty", blockinspect: true, blockemote: true, replaceemote: "🐱" },
    { name: "Bunny Mask", value: "mask_bunny", blockinspect: true, blockemote: true, replaceemote: "🐰" },
    { name: "Doll Visor", value: "doll_visor", blockinspect: true, blockemote: true },
    { name: "VR Headset", value: "vr_visor", blockinspect: true },
    { name: "Witchy Glasses", value: "glasses_witchy" },
    { name: "Full Frame Glasses", value: "glasses_fullframe" },
    { name: "Nostalgia Glasses", value: "glasses_nostalgia" },
    { name: "Ridiculously Big Witch Hat", value: "witchhat_big" },
    { name: "Ridiculously Big Witch Hat 2", value: "witchhat_big2" },
    { name: "Ridiculously Big Witch Hat 3", value: "witchhat_big3" },
    { name: "Final Ridiculously Big Witch Hat", value: "witchhat_big4" },
    { name: "Princess Crown", value: "princess_crown" },
]

/**************
 * Discord API Requires an array of objects in form:
 * { name: "Latex Armbinder", value: "armbinder_latex" }
 ********************/
const loadHeadwearTypes = () => {
    process.headtypes = headweartypes.map((item) => {return { name: item.name, value: item.value }})
}

const assignHeadwear = (userID, headwear, origbinder) => {
    if (process.headwear == undefined) { process.headwear = {} }
    let originalbinder = process.headwear[userID]?.origbinder
    if (process.headwear[userID]) {
        process.headwear[userID].wornheadwear.push(headwear);
    }
    else {
        process.headwear[userID] = {
            wornheadwear: [headwear],
            origbinder: originalbinder ?? origbinder
        }
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/headwearusers.txt`, JSON.stringify(process.headwear));
}

const getHeadwear = (userID) => {
    if (process.headwear == undefined) { process.headwear = {} }
    return process.headwear[userID]?.wornheadwear ? process.headwear[userID]?.wornheadwear : [];
}

const getHeadwearBinder = (userID) => {
    if (process.headwear == undefined) { process.headwear = {} }
    return process.headwear[userID]?.origbinder;
}

const getLockedHeadgear = (userID) => {
    
}

const deleteHeadwear = (userID, headwear) => {
    if (process.headwear == undefined) { process.headwear = {} }
    if (!process.headwear[userID]) { return false }
    if (headwear && process.headwear[userID].wornheadwear.includes(headwear)) {
        process.headwear[userID].wornheadwear.splice(process.headwear[userID].wornheadwear.indexOf(headwear), 1)
        if (process.headwear[userID].wornheadwear.length == 0) {
            delete process.headwear[userID]
        }
    }
    else if (process.headwear[userID]) {
        delete process.headwear[userID];
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/headwearusers.txt`, JSON.stringify(process.headwear));
}

const getHeadwearName = (userID, headnname) => {
    if (process.headwear == undefined) { process.headwear = {} }
    let convertmittenarr = {}
    for (let i = 0; i < headweartypes.length; i++) {
        convertmittenarr[headweartypes[i].value] = headweartypes[i].name
    }
    if (headnname) {
        return convertmittenarr[headnname];
    }
    /*
    else if (process.headwear[userID]?.wornheadwear) {
        return convertmittenarr[process.mitten[userID]?.mittenname]
    }*/ // I honestly dont have a clean way to represent this. 
    else {
        return undefined;
    }
}

// Gets the full headwear entry
// There's a better way to do this.
// I didnt feel like doing some kind of .some condition checking. 
// Plz simplify.
const getHeadwearBlocks = (headnname) => {
    let convertmittenarr = {}
    for (let i = 0; i < headweartypes.length; i++) {
        convertmittenarr[headweartypes[i].value] = headweartypes[i]
    }
    if (headnname) {
        return convertmittenarr[headnname];
    }
    else {
        return undefined;
    }
}

// Returns an object with true/false if *ANY* headwear they're wearing 
// blocks a given function. 
// { canEmote: true, canInspect: true }
const getHeadwearRestrictions = (userID) => {
    let allowedperms = {
        canEmote: true,
        canInspect: true
    }
    let wornheadwear = getHeadwear(userID);
    for (let i = 0; i < wornheadwear.length; i++) {
        if (getHeadwearBlocks(wornheadwear[i]).blockemote) {
            allowedperms.canEmote = false
        }
        if (getHeadwearBlocks(wornheadwear[i]).blockinspect) {
            allowedperms.canInspect = false
        }
    }

    return allowedperms
}

// Removes all emoji, optionally using an assigned emoji if they are wearing a mask with it!
const processHeadwearEmoji = (userID, text) => {
    //if (!getHeadwearRestrictions(userID).canEmote) { return text } // Not blocking emotes, no need to change anything
    
    let regex = /((<a?:[^:]+:[^>]+>)|(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))+/g
    let replaceemote = "";
    let wornheadwear = getHeadwear(userID);
    for (let i = 0; i < wornheadwear.length; i++) {
        if (getHeadwearBlocks(wornheadwear[i]).replaceemote != undefined) {
            replaceemote = getHeadwearBlocks(wornheadwear[i]).replaceemote
        }
    }

    let outtext = text.replaceAll(regex, replaceemote);

    if (replaceemote && !outtext.includes(replaceemote)) { outtext = `${outtext} ${replaceemote}`}
    
    if (outtext.length == 0) { outtext = `*(<@${userID}>'s face shows no emotion...)*`}
    return outtext
}

exports.headweartypes = headweartypes
exports.loadHeadwearTypes = loadHeadwearTypes;
exports.assignHeadwear = assignHeadwear
exports.getHeadwear = getHeadwear
exports.getHeadwearBinder = getHeadwearBinder;
exports.deleteHeadwear = deleteHeadwear
exports.getHeadwearName = getHeadwearName;
exports.getHeadwearRestrictions = getHeadwearRestrictions;

exports.processHeadwearEmoji = processHeadwearEmoji;