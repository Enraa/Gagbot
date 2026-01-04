const fs = require('fs');
const path = require('path');

let wearabletypes = [
    { name: "Latex Catsuit", value: "catsuit_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Maid Dress", value: "maid_dress", colorable: true, forbiddenColors: [], uniquecolors: ["Gothic"] },
    { name: "Leather Harness", value: "leather_harness" },
    { name: "Leather Choker", value: "leather_choker" },
    { name: "Labcoat", value: "labcoat" },
    { name: "Nurse Outfit", value: "outfit_nurse" },
    { name: "Latex Nurse Outfit", value: "outfit_latexnurse" },
    { name: "Playbunny Outfit", value: "outfit_playbunny" },
    { name: "Race Queen Outfit", value: "outfit_racequeen", },
    { name: "Spy Suit", value: "outfit_spy", },
    { name: "Songbird Ensemble", value: "outfit_songbird", colorable: true },
    { name: "Nametag", value: "nametag", },
    { name: "Nightie", value: "nightie", colorable: true },
    { name: "Bondage Wrist Cuffs", value: "cuffswrist_bondage", colorable: true, uniquecolors: ["Hardlight", "Steel", "Leather", "Rubber", "Cursed"] },
    { name: "Bondage Ankle Cuffs", value: "cuffsankle_bondage", colorable: true, uniquecolors: ["Hardlight", "Steel", "Leather", "Rubber", "Cursed"] },
    { name: "Leather Bra", value: "leather_bra", colorable: true },
    { name: "Leather Dress", value: "leather_dress", colorable: true },
    { name: "Leather Pony Boots", value: "leather_ponyboots", colorable: true },
    { name: "Leather Thigh Belts", value: "leather_thighbelts", colorable: true },
    { name: "Leather Pony Tack", value: "leather_ponytack", colorable: true },
    { name: "Rope Karada", value: "rope_karada", colorable: true },
    { name: "Rope Ties", value: "rope_ties", colorable: true },
    { name: "Shock Module", value: "shock_module" },
    { name: "Backpack", value: "backpack" },
    { name: "Tail", value: "tail", colorable: true, uniquecolors: ["Cat", "Dog", "Bunny", "Sheep", "Demon"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Wings", value: "wings", colorable: true, uniquecolors: ["Cat", "Dog", "Demon", "Angel", "Imp", "Succubus", "Bat", "Butterfly", "Dragon"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
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
    { name: "Drone Suit", value: "dronesuit", colorable: true },
    { name: "Latex Drone Suit", value: "latex_dronesuit", colorable: true, uniquecolors: ["Starry", "Shadow"] },
    { name: "High Heels", value: "highheels_latex", colorable: true },
    { name: "Frilled Dress", value: "frilled_dress", colorable: true },
    { name: "Strapless Dress", value: "strapless_dress", colorable: true },
    { name: "Halter Dress", value: "halter_dress", colorable: true },
    { name: "Skimpy Dress", value: "skimpy_dress", colorable: true },
    { name: "Flowy Dress", value: "flowy_dress", colorable: true, uniquecolors: ["Gothic"] },
    { name: "Latex Flowy Dress", value: "latex_flowy_dress", colorable: true, uniquecolors: ["Gothic", "Starry", "Shadow"] },
    { name: "Evening Dress", value: "evening_dress", colorable: true, uniquecolors: ["Gothic"] },
    { name: "Latex Evening Dress", value: "latex_evening_dress", colorable: true, uniquecolors: ["Gothic", "Starry", "Shadow"] },
    { name: "Princess Dress", value: "princess_dress", colorable: true, uniquecolors: ["Gothic", "Sheep"] },
    { name: "Sundress", value: "sun_dress", colorable: true },
    { name: "Kimono", value: "kimono", colorable: true, uniquecolors: ["Gothic"] },
    { name: "Latex Kimono", value: "latex_kimono", colorable: true, uniquecolors: ["Gothic", "Starry", "Shadow"] },
    { name: "Yukata", value: "yukata", colorable: true, uniquecolors: ["Gothic", "Floral"] },
    { name: "Latex Yukata", value: "latex_yukata", colorable: true, uniquecolors: ["Gothic", "Starry", "Shadow"] },
    { name: "Minidress", value: "mini_dress", colorable: true, uniquecolors: ["Gothic"] },
    { name: "Latex Minidress", value: "latex_mini_dress", colorable: true, uniquecolors: ["Gothic", "Starry", "Shadow"] },
    { name: "Chinese Dress", value: "chinese_dress", colorable: true, uniquecolors: ["Gothic"] },
    { name: "Latex Chinese Dress", value: "latex_chinese_dress", colorable: true, uniquecolors: ["Gothic", "Starry", "Shadow"] },
    { name: "Shrine Maiden's Robe", value: "shrine_maiden", colorable: true, uniquecolors: ["Gothic"] },
    { name: "Latex Shrine Maiden's Robe", value: "latex_shrine_maiden", colorable: true, uniquecolors: ["Gothic", "Starry", "Shadow"] },
    { name: "Bridal Wristlets", value: "wristlets_bridal", colorable: true, uniquecolors: ["Gothic"] },
    { name: "Fashionable Suit", value: "suit_fashionable", colorable: true },
    { name: "Sukumizu", value: "sukumizu", colorable: true },
    { name: "Ballet Shoes", value: "ballet_shoes", colorable: true },
    { name: "Sandals", value: "sandals", colorable: true },
    { name: "Comfy Oversized Hoodie", value: "hoodie_oversized", colorable: true },
    { name: "Toenail Polish", value: "polish_toenails", colorable: true, uniquecolors: ["Color-changing", "Sparkly", "Glow-in-the-Dark", "Ultraviolet", "Sanguine"] },
    { name: "Fingernail Polish", value: "polish_fingernails", colorable: true, uniquecolors: ["Color-changing", "Sparkly", "Glow-in-the-Dark", "Ultraviolet", "Sanguine"] },
    { name: "Opera Gloves", value: "gloves_opera", colorable: true, uniquecolors: ["Gothic"] },
    { name: "Latex Opera Gloves", value: "gloves_opera_latex", colorable: true, uniquecolors: ["Gothic", "Starry", "Shadow"] },
    { name: "Stylish Hat", value: "stylish_hat", colorable: true },
    { name: "Fluffy Scarf", value: "scarf_fluffy", colorable: true },
    { name: "Winter Sweater", value: "sweater_winter", colorable: true },
    { name: "Nipple Pasties", value: "nipple_pasties", colorable: true },
    { name: "Cloak", value: "cloak", colorable: true, uniquecolors: ["Witch", "Rogue", "Vampire"] },
    { name: "Latex Cloak", value: "latex_cloak", colorable: true, uniquecolors: ["Witch", "Rogue", "Vampire"] },
    { name: "Wool Suit", value: "suit_wool", colorable: true },
    { name: "Bunny Bustier", value: "bunnybustier", colorable: true },
    { name: "Bunny Tights", value: "bunnytights", colorable: true },
    { name: "Bunny Shoes", value: "bunnybustier", colorable: true },
    { name: "Latex Bunny Bustier", value: "latex_bunnybustier", colorable: true, uniquecolors: ["Starry", "Shadow"] },
    { name: "Latex Bunny Tights", value: "latex_bunnytights", colorable: true, uniquecolors: ["Starry", "Shadow"] },
    { name: "Latex Bunny Shoes", value: "latex_bunnybustier", colorable: true, uniquecolors: ["Starry", "Shadow"] },
    { name: "Control Harness", value: "control_harness" },
    { name: "Cyber Doll Harness", value: "cyberdoll_harness" },
    { name: "Exhibitionist", value: "exhibitionist" },
    { name: "Dragonscale Mail", value: "dragonscale_mail", colorable: true },
    { name: "Binding Dress", value: "binding_dress", colorable: true, uniquecolors: ["Latex","Leather"] },
    { name: "Pleated Skirt", value: "pleated_skirt", colorable: true, uniquecolors: ["Latex", "Witchy", "Gothic", "Starry", "Shadow"] },
    { name: "Miniskirt", value: "pleated_skirt", colorable: true, uniquecolors: ["Latex", "Witchy", "Gothic", "Cheerleader"] },
    { name: "Skirt", value: "skirt", colorable: true },
    { name: "Ankle Boots", value: "ankleboots", colorable: true },
    { name: "Button-up Blouse", value: "buttonup_blouse", colorable: true, uniquecolors: ["Witchy", "Latex"] },
    { name: "Comfortable Jacket", value: "jacket_comfortable", colorable: true, uniquecolors: ["Leather", "Bomber", "Double-breasted"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"]  },
    { name: "Wristcuff", value: "wristcuff", colorable: true, uniquecolors: ["Silver", "Gold", "Platinum", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Necklace", value: "necklace", colorable: true, uniquecolors: ["Silver", "Gold", "Platinum", "Cobalt", "Gothic", "Vampire", "Angel Wings"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "T-shirt", value: "tshirt", colorable: true, uniquecolors: ["Goth Metal", "Plain", "Black", "Alternative", "Grey", "Simple", "Striped"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Latex Legbinder", value: "latex_legbinder", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Leather Legbinder", value: "leather_legbinder", colorable: true, forbiddenColors: [], uniquecolors: [] },
    { name: "Latex Hobble Skirt", value: "latex_hobble", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Leather Hobble Skirt", value: "leather_hobble", colorable: true, forbiddenColors: [], uniquecolors: [] },
    { name: "Latex Skirt", value: "latex_skirt", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Leather Skirt", value: "leather_skirt", colorable: true, forbiddenColors: [], uniquecolors: [] },
    { name: "Latex Mermaid Tail", value: "latex_mermaid", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow"] },
    { name: "Holy Knight Armor", value: "armor_holyknight" },
    { name: "Latex Bikini", value: "bikini_latex", colorable: true, forbiddenColors: [], uniquecolors: ["Starry", "Shadow", "Cow"] },
    { name: "Bikini", value: "bikini", colorable: true, uniquecolors: ["Cow"] },
    { name: "Stockings", value: "stockings", colorable: true },
    { name: "Pantyhose", value: "pantyhose", colorable: true },
    { name: "Latex Stockings", value: "stockings", colorable: true, uniquecolors: ["Starry", "Shadow"] },
    { name: "Latex Pantyhose", value: "pantyhose", colorable: true, uniquecolors: ["Starry", "Shadow"] },
    { name: "Fishnets", value: "fishnets", colorable: true },
    { name: "Waist Cincher", value: "waistcincher", colorable: true },
    { name: "Latex Waist Cincher", value: "waistcincher_latex", colorable: true },
    { name: "Garters", value: "garters", colorable: true },
    { name: "Latex Garters", value: "garters_latex", colorable: true, uniquecolors: ["Starry", "Shadow"] },
    { name: "Garter Belt", value: "gartersbelt", colorable: true },
    { name: "Latex Garter Belt", value: "gartersbelt_latex", colorable: true, uniquecolors: ["Starry", "Shadow"] },
    { name: "Thighhighs", value: "thighhighs", colorable: true },
    { name: "Latex Thighhighs", value: "thighhighs_latex", colorable: true, uniquecolors: ["Starry", "Shadow"] },
    { name: "Striped Socks", value: "stripedsocks", colorable: true },
    { name: "Bodystocking", value: "bodystocking", colorable: true },
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
    // Copy the array so we dont mutate the original lmao
    let wearablestoadd = wearabletypes.slice(0);
    // Iterate over each wearable type, filtering only the ones that are colorable. 
    let colorables = wearabletypes.filter((w) => w.colorable);

    // Now for each colorable, add an instance of each color to the list. 
    colorables.forEach((w) => {
        let uniquecolors = w.uniquecolors ?? [];
        // Filter out any forbidden colors, if specified;
        let colorss = colors.slice(0);
        if (w.forbiddenColors) {
            colorss = colorss.filter((c) => !w.forbiddenColors.includes(c));
        }
        // Add all the colors and their unique forms
        let colorstoadd = colorss.concat(...uniquecolors);
        // Now for each color, push to the array.
        colorstoadd.forEach((c) => {
            let newobject = Object.assign({}, w);
            newobject.name = `${c} ${w.name}`;
            newobject.value = `${w.value}_${c.toLowerCase()}`
            wearablestoadd.push(newobject)
        })
    })

    let outarr = wearablestoadd.map((item) => {return { name: item.name, value: item.value }})
    // Since I have zero clue how to prevent the duplicates, 
    // the code feels solid and doesnt seem to have any obvious bugs.
    // I'm just gonna dedupe them before committing them. This is a dumb workaround. 
    let outmap = new Map();
    for (const i of outarr) {
        outmap.set(i.value, i)
    }
    process.wearableslist = Array.from(outmap.values());
    console.log(`Wearables list is ${process.wearableslist.length} entries long.`);
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
    if (wearable && process.wearable[userID].wornwearable.includes(wearable) && !getLockedWearable(userID).includes(wearable)) {
        process.wearable[userID].wornwearable.splice(process.wearable[userID].wornwearable.indexOf(wearable), 1)
        if (process.wearable[userID].wornwearable.length == 0) {
            delete process.wearable[userID]
        }
    }
    else if (process.wearable[userID]) {
        let locks = getLockedWearable(userID);
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
    for (let i = 0; i < process.wearableslist.length; i++) {
        convertmittenarr[process.wearableslist[i].value] = process.wearableslist[i].name
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