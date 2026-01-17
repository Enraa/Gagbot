const fs = require('fs');
const path = require('path');
const https = require('https');

const heavytypes = [
    // Armbinders
    { name: "Ancient Armbinder", value: "armbinder_ancient", denialCoefficient: 3.5 },
    { name: "Latex Armbinder", value: "armbinder_latex", denialCoefficient: 2 },
    { name: "Leather Armbinder", value: "armbinder_leather", denialCoefficient: 2 },
    { name: "High Security Armbinder", value: "armbinder_secure", denialCoefficient: 3.5 },
    { name: "Shadow Latex Armbinder", value: "armbinder_shadowlatex", denialCoefficient: 3 },
    { name: "Crystal Armbinder", value: "armbinder_crystal", denialCoefficient: 3 },
    { name: "Black Hole Armbinder", value: "armbinder_blackhole", denialCoefficient: 3.5 },
    { name: "Wolfbinder", value: "armbinder_wolf", denialCoefficient: 3 },
    { name: "Wolf Queenbinder", value: "armbinder_wolfqueen", denialCoefficient: 3 },

    // Boxbinders
    { name: "Latex Boxbinder", value: "boxbinder_latex", denialCoefficient: 2 },
    { name: "Leather Boxbinder", value: "boxbinder_leather", denialCoefficient: 2.5 },
    { name: "High-Security Boxbinder", value: "boxbinder_hisec", denialCoefficient: 3.5 },
    { name: "Experimental Boxtie Binder", value: "boxbinder_experimental", denialCoefficient: 3.5 },
    { name: "Black Hole Boxbinder", value: "boxbinder_blackhole", denialCoefficient: 2 },
    { name: "Dragon Queen Straps", value: "boxbinder_dragon", denialCoefficient: 2.5 },

    // Straitjackets
    { name: "Comfy Straitjacket", value: "straitjacket_comfy", denialCoefficient: 3 },
    { name: "Maid Straitjacket", value: "straitjacket_maid", denialCoefficient: 3.5 },
    { name: "Maid Punishment Straitjacket", value: "straitjacket_maidpunishment", denialCoefficient: 4.5 },
    { name: "Doll Straitjacket", value: "straitjacket_doll", denialCoefficient: 3.5 },
    { name: "Shadow Latex Straitjacket", value: "straitjacket_shadowlatex", denialCoefficient: 4 },
    { name: "Asylum Straitjacket", value: "straitjacket_asylum", denialCoefficient: 5 },
    { name: "Black Hole Straitjacket", value: "straitjacket_blackhole", denialCoefficient: 4.5 },

    // Petsuits
    { name: "Piddlefours", value: "petsuit_piddlefours", denialCoefficient: 2 },
    { name: "Leather Petsuit", value: "petsuit_leather", denialCoefficient: 2.5 },
    { name: "Alchemical Petsuit", value: "petsuit_latex", denialCoefficient: 2.5 },
    { name: "Autotape Petsuit", value: "petsuit_tape", denialCoefficient: 2.5 },
    { name: "Shadow Latex Petsuit", value: "petsuit_shadowlatex", denialCoefficient: 3 },
    { name: "Bast Petsuit", value: "petsuit_bast", denialCoefficient: 3 },
    { name: "Nevermere Punishment Suit", value: "petsuit_nevermere", denialCoefficient: 3.5 },
    { name: "Ancient Petsuit", value: "petsuit_ancient", denialCoefficient: 4 },

    // Static Restraints
    { name: "Display Stand", value: "displaystand", denialCoefficient: 4 },
    { name: "One Bar Prison", value: "one_bar_prison", denialCoefficient: 1.5 },
    { name: "Latex Encasement Stand", value: "encasementstand_latex", denialCoefficient: 4 },
    { name: "Sarcophagus", value: "sarco_mummy", denialCoefficient: 3 },
    { name: "Wooden Horse", value: "wooden_horse", denialCoefficient: 3 },
    { name: "X-Frame", value: "x_frame", denialCoefficient: 5 },
    { name: "Dancer's Pole", value: "pole_dancer", denialCoefficient: 1.5 },
    { name: "Leashing Post", value: "leashing_post", denialCoefficient: 2.5 },
    { name: "Latex Vacbed", value: "vacbed_latex", denialCoefficient: 3.5 },
    { name: "Latex Vaccube", value: "vaccube_latex", denialCoefficient: 4.5 },
    { name: "Doll Processing Facility", value: "doll_processing", denialCoefficient: 5 },
    { name: "Doll Storage Unit", value: "doll_storage", denialCoefficient: 3.5 },
    { name: "Weighted Blanket", value: "blanket_weighted", denialCoefficient: 1.5 },
    { name: "Pile of Cats", value: "catpile", denialCoefficient: 99 }, // Are you ***really*** going to disturb the kitties to let go?
    { name: "Giant Pile of Plushies", value: "plushie_pile", denialCoefficient: 1.5 },
    { name: "Bed Restraints", value: "bedrestraints", denialCoefficient: 6 },
    { name: "Massage Table Binding", value: "massage_table_binding", denialCoefficient: 2 },
    { name: "Pet Cage", value: "pet_cage", denialCoefficient: 4 },
    { name: "Chair with Cuffs", value: "chaircuffs", denialCoefficient: 3.5 },
    { name: "Resin Coating", value: "resin_coated", denialCoefficient: 4 },

    // Metal Restraints
    { name: "Scavenger's Daughter", value: "scavengersdaughter", denialCoefficient: 4 },
    { name: "Yoke", value: "yoke", denialCoefficient: 2 },
    { name: "Hardlight Cuffs (loose links)", value: "hardlight_looselink", denialCoefficient: 1.5 },
    { name: "Hardlight Cuffs (hogtie)", value: "hardlight_hogtie", denialCoefficient: 3 },
    { name: "Hardlight Cuffs (strict)", value: "hardlight_strict", denialCoefficient: 4.5 },

    // Rope Restraints
    { name: "Hogtie", value: "rope_hogtie", denialCoefficient: 3 },
    { name: "Shrimp Tie", value: "rope_shrimp", denialCoefficient: 3 },
    { name: "Frogtie", value: "rope_frogtie", denialCoefficient: 2.5 },
    { name: "Rope Boxtie", value: "rope_boxtie", denialCoefficient: 2 },
    { name: "Ribbons", value: "ribbons", denialCoefficient: 1.5 },
    { name: "Suspended Frogtie", value: "rope_suspension_frog", denialCoefficient: 3 },

    //Encasement and Wrappings
    { name: "Bandage Wrapping", value: "bandage_wrap", denialCoefficient: 1.5 },
    { name: "Autotape Wrapping", value: "autotape_wrap", denialCoefficient: 2 },
    //{ name: "Slime Coating", value: "encasement_slime", denialCoefficient: 2 },               Names Needed?
    //{ name: "Solidified Rubber Coating", value: "encasement_slime", denialCoefficient: 3 },
    { name: "Crystalline Pillar", value: "encasement_crystal", denialCoefficient: 4 },
    { name: "Latex Sphere", value: "sphere_latex", denialCoefficient: 3.5 },
    { name: "Latex Sleepsack", value: "sleepsack_latex", denialCoefficient: 4 },
    { name: "Duffel Bag", value: "duffel_bag", denialCoefficient: 2 },
    { name: "Shadow Latex Ballsuit", value: "shadow_latex_ball", denialCoefficient: 4 },
    { name: "Magic Mirror", value: "encasement_mirror", denialCoefficient: 5 },

    // Misc Heavy Restraints
    { name: "Lockdown Virus", value: "lockdown_virus", denialCoefficient: 4 },
    // { name: "Silk Cocoon", value: "silk_cocoon", denialCoefficient: 2 },   Removed due to Arachnophobia
    { name: "Binding Dress", value: "dress_binding", denialCoefficient: 4.5 },
    { name: "Blanket Burrito", value: "blanket_burrito", denialCoefficient: 2 },
    { name: "Toasty Kotatsu", value: "kotatsu_trap", denialCoefficient: 1.5 },
    { name: "Festive Ribbons", value: "ribbons_festive", denialCoefficient: 1.5 },
    { name: "Wrapping Paper", value: "wrapping_paper", denialCoefficient: 2 },
    { name: "Shadow Hands", value: "shadowhands", denialCoefficient: 1.5 },
    { name: "Entangling Vines", value: "entangling_vines", denialCoefficient: 1.5 },
    //{ name: "Glue Spill", value: "glue_trap", denialCoefficient: 3.5 },
    { name: "Bondage Exosuit", value: "exosuit_bondage", denialCoefficient: 5 },
    { name: "Sticky Glue", value: "stickyglue_bondage", denialCoefficient: 5 },
    { name: "Costumer Mimic", value: "costumer_mimic", denialCoefficient: 5 },
];


/**************
 * Discord API Requires an array of objects in form:
 * { name: "Latex Armbinder", value: "armbinder_latex" }
 ********************/
const loadHeavyTypes = () => {
    process.heavytypes = heavytypes.map((item) => { return { name: item.name, value: item.value } })
}

const convertheavy = (type) => {
    let convertheavyarr
    for (let i = 0; i < heavytypes.length; i++) {
        if (convertheavyarr == undefined) { convertheavyarr = {} }
        convertheavyarr[heavytypes[i].value] = heavytypes[i].name
    }
    return convertheavyarr[type];
}

const heavyDenialCoefficient = (type) => {
    return heavytypes.find(h => h.value == type)?.denialCoefficient;
}

const assignHeavy = (user, type, origbinder) => {
    if (process.heavy == undefined) { process.heavy = {} }
    let originalbinder = process.heavy[user]?.origbinder
    process.heavy[user] = {
        type: convertheavy(type),
        typeval: type,
        origbinder: originalbinder ?? origbinder
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.heavy = true;
}

const getHeavy = (user) => {
    if (process.heavy == undefined) { process.heavy = {} }
    return process.heavy[user];
}

const getHeavyBinder = (user) => {
    if (process.heavy == undefined) { process.heavy = {} }
    return process.heavy[user]?.origbinder;
}

const removeHeavy = (user) => {
    if (process.heavy == undefined) { process.heavy = {} }
    delete process.heavy[user];
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.heavy = true;
}

exports.loadHeavyTypes = loadHeavyTypes
exports.heavytypes = heavytypes
exports.assignHeavy = assignHeavy
exports.getHeavy = getHeavy
exports.getHeavyBinder = getHeavyBinder;
exports.removeHeavy = removeHeavy
exports.commandsheavy = heavytypes
exports.convertheavy = convertheavy
exports.heavyDenialCoefficient = heavyDenialCoefficient;