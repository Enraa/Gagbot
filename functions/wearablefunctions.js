const fs = require('fs');
const path = require('path');

let wearabletypes = [
    { name: "Latex Catsuit", value: "catsuit_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Maid Dress", value: "maid_dress", colorable: true, forbiddenColors: [], uniquecolors: ["Gothic"] },
    { name: "Leather Harness", value: "leather_harness" },
    { name: "Leather Bra", value: "leather_bra", colorable: true },
    { name: "Leather Dress", value: "leather_dress", colorable: true },
    { name: "Leather Pony Boots", value: "leather_ponyboots", colorable: true },
    { name: "Leather Thigh Belts", value: "leather_thighbelts", colorable: true },
    { name: "Shock Module", value: "shock_module" },
    { name: "Big Cute Ribbon", value: "bigcute_ribbon", colorable: true },
    { name: "Latex Bra", value: "bra_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Latex Panties", value: "panties_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Latex Dress", value: "dress_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow", "Witchy"] },
    { name: "Latex Wrist Cuffs", value: "cuffswrist_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Latex Ankle Cuffs", value: "cuffsankle_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Latex Maid Dress", value: "maiddress_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow", "Gothic"] },
    { name: "Latex Ballet Heels", value: "balletheels_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Latex High Heels", value: "highheels_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Latex Gloves", value: "gloves_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "High Heels", value: "highheels_latex", colorable: true },
    { name: "Frilled Dress", value: "frilled_dress", colorable: true },
    { name: "Strapless Dress", value: "strapless_dress", colorable: true },
    { name: "Halter Dress", value: "halter_dress", colorable: true },
    { name: "Binding Dress", value: "binding_dress", colorable: true, uniquecolors: ["Latex","Leather"] },
    { name: "Pleated Skirt", value: "pleated_skirt", colorable: true, uniquecolors: ["Latex", "Witchy", "Gothic", "Starry", "Shadow"] },
    { name: "Miniskirt", value: "pleated_skirt", colorable: true, uniquecolors: ["Latex", "Witchy", "Gothic", "Cheerleader"] },
    { name: "Button-up Blouse", value: "buttonup_blouse", colorable: true, uniquecolors: ["Witchy", "Latex"] },
    { name: "Comfortable Jacket", value: "jacket_comfortable", colorable: true, uniquecolors: ["Leather", "Bomber", "Double-breasted"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"]  },
    { name: "Wristcuff", value: "wristcuff", colorable: true, uniquecolors: ["Silver", "Gold", "Platinum", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Necklace", value: "necklace", colorable: true, uniquecolors: ["Silver", "Gold", "Platinum", "Cobalt", "Gothic", "Vampire", "Angel Wings"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "T-shirt", value: "tshirt", colorable: true, uniquecolors: ["Goth Metal", "Plain", "Black", "Alternative", "Grey", "Simple"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
]

// Each colorable entry above will have a copy of the following added
// Unless it is excluded on forbiddenColors. 
const colors = ["Black", "Red", "Purple", "Green", 
                "Orange", "Red", "Pink", "White", 
                "Yellow", "Cyan", "Aqua", "Blue", 
                "Indigo", "Gray", "Brown"]

/**************
 * Discord API Requires an array of objects in form:
 * { name: "Latex Armbinder", value: "armbinder_latex" }
 ********************/
const loadWearables = () => {
    // Iterate over each wearable type, filtering only the ones that are colorable. 
    let colorables = wearabletypes.filter((w) => w.colorable);

    // Now for each colorable, add an instance of each color to the list. 
    colorables.forEach((w) => {
        let uniquecolors = w.uniquecolors ?? [];
        // Filter out any forbidden colors, if specified (why?);
        let colorss = colors;
        if (w.forbiddenColors) {
            colorss = colors.filter((c) => !w.forbiddenColors.includes(c));
        }
        // Add all the colors and their unique forms
        let colorstoadd = colorss.concat(...uniquecolors);
        // Now for each color, push to the array.
        colorstoadd.forEach((c) => {
            let newobject = Object.assign({}, w);
            newobject.name = `${c} ${w.name}`;
            newobject.value = `${w.value}_${c.toLowerCase()}`
            wearabletypes.push(newobject)
        })
    })

    process.wearableslist = wearabletypes.map((item) => {return { name: item.name, value: item.value }})
}

const assignWearable = (userID, wearable) => {
    if (process.wearable == undefined) { process.wearable = {} }
    if (process.wearable[userID]) {
        process.wearable[userID].wornwearable.push(wearable);
    }
    else {
        process.wearable[userID] = {
            wornwearable: [wearable]
        }
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.wearable = true;
}

const getWearable = (userID) => {
    if (process.wearable == undefined) { process.wearable = {} }
    return process.wearable[userID]?.wornwearable ? process.wearable[userID]?.wornwearable : [];
}

const getLockedWearable = (userID) => {
    if (process.wearable == undefined) { process.wearable = {} }
    return process.wearable[userID]?.locked ? process.wearable[userID]?.locked : [];
}

const addLockedWearable = (userID, wearable) => {
    if (process.wearable == undefined) { process.wearable = {} }
    if (process.wearable[userID]) {
        if (process.wearable[userID].locked == undefined) {
            process.wearable[userID].locked = [wearable]
        }
        else { 
            process.wearable[userID].locked.push(wearable);
        }
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.wearable = true;
}

const removeLockedWearable = (userID, wearable) => {
    if (process.wearable == undefined) { process.wearable = {} }
    if (process.wearable[userID]) {
        if (process.wearable[userID].locked == undefined) {
            return;
        }
        else { 
            if (process.wearable[userID].locked.includes(wearable)) {
                process.wearable[userID].locked.splice(process.wearable[userID].locked.indexOf(wearable), 1);
            }
            if (process.wearable[userID].locked.length == 0) {
                delete process.wearable[userID].locked
            }
        }
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.wearable = true;
}

const deleteWearable = (userID, wearable) => {
    if (process.wearable == undefined) { process.wearable = {} }
    if (!process.wearable[userID]) { return false }
    if (wearable && process.wearable[userID].wornwearable.includes(wearable) && !getLockedHeadgear(userID).includes(wearable)) {
        process.wearable[userID].wornwearable.splice(process.wearable[userID].wornwearable.indexOf(wearable), 1)
        if (process.wearable[userID].wornwearable.length == 0) {
            delete process.wearable[userID]
        }
    }
    else if (process.wearable[userID]) {
        let locks = getLockedHeadgear(userID);
        let savedheadgear = [];
        process.wearable[userID].wornwearable.forEach((g) => {
            if (locks.includes(g)) {
                savedheadgear.push(g)
            }
        })
        process.wearable[userID].wornwearable = savedheadgear;
        if (process.wearable[userID].wornwearable.length == 0) {
            delete process.wearable[userID]
        }
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.wearable = true;
}

const getWearableName = (userID, wearablename) => {
    if (process.wearable == undefined) { process.wearable = {} }
    let convertmittenarr = {}
    for (let i = 0; i < wearabletypes.length; i++) {
        convertmittenarr[wearabletypes[i].value] = wearabletypes[i].name
    }
    if (wearablename) {
        return convertmittenarr[wearablename];
    }
    else {
        return undefined;
    }
}

exports.wearabletypes = wearabletypes
exports.loadWearables = loadWearables;

exports.assignWearable = assignWearable
exports.getWearable = getWearable
exports.deleteWearable = deleteWearable
exports.getWearableName = getWearableName;

exports.addLockedWearable = addLockedWearable;
exports.getLockedWearable = getLockedWearable;
exports.removeLockedWearable = removeLockedWearable; 