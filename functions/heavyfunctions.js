const fs = require('fs');
const path = require('path');
const https = require('https');

const heavytypes = [
    { name: "Latex Armbinder", value: "armbinder_latex", denialCoefficient: 2 },
    { name: "Shadow Latex Armbinder", value: "armbinder_shadowlatex", denialCoefficient: 3 },
    { name: "Wolfbinder", value: "armbinder_wolf", denialCoefficient: 3 },
    { name: "Ancient Armbinder", value: "armbinder_ancient", denialCoefficient: 3.5 },
    { name: "High Security Armbinder", value: "armbinder_secure", denialCoefficient: 3.5 },
    { name: "Latex Boxbinder", value: "boxbinder_latex", denialCoefficient: 2 },
    { name: "Comfy Straitjacket", value: "straitjacket_comfy", denialCoefficient: 3 },
    { name: "Maid Straitjacket", value: "straitjacket_maid", denialCoefficient: 3.5 },
    { name: "Maid Punishment Straitjacket", value: "straitjacket_maidpunishment", denialCoefficient: 4.5 },
    { name: "Doll Straitjacket", value: "straitjacket_doll", denialCoefficient: 3.5 },
    { name: "Black Hole Boxbinder", value: "boxbinder_blackhole", denialCoefficient: 2 },
    { name: "Shadow Latex Petsuit", value: "petsuit_shadowlatex", denialCoefficient: 3 },
    { name: "Bast Petsuit", value: "petsuit_bast", denialCoefficient: 3 },
    { name: "Display Stand", value: "displaystand", denialCoefficient: 4 },
    { name: "Latex Sleepsack", value: "sleepsack_latex", denialCoefficient: 4 },
    { name: "Scavenger's Daughter", value: "scavengersdaughter", denialCoefficient: 4 },
    { name: "Shadow Latex Straitjacket", value: "straitjacket_shadowlatex", denialCoefficient: 4 },
    { name: "Dragon Queen Straps", value: "boxbinder_dragon", denialCoefficient: 2.5 },
    { name: "Black Hole Armbinder", value: "armbinder_blackhole", denialCoefficient: 3.5 },
    { name: "Crystal Armbinder", value: "armbinder_crystal", denialCoefficient: 3 },
    { name: "Wolf Queenbinder", value: "armbinder_wolfqueen", denialCoefficient: 3 },
    { name: "Leather Armbinder", value: "Armbinder_leather", denialCoefficient: 2 },
    { name: "High-Security Boxbinder", value: "boxbinder_hisec", denialCoefficient: 3.5 },
    { name: "Experimental Boxtie Binder", value: "boxbinder_experimental", denialCoefficient: 3.5 },
    { name: "Leather Boxbinder", value: "boxbinder_leather", denialCoefficient: 2.5 },
    { name: "Asylum Straitjacket", value: "straitjacket_asylum", denialCoefficient: 5 },
    { name: "Black Hole Straitjacket", value: "straitjacket_blackhole", denialCoefficient: 4.5 },
    { name: "Giant Pile of Plushies", value: "plushie_pile", denialCoefficient: 1.5 },
    { name: "Lockdown Virus", value: "lockdown_virus", denialCoefficient: 4 },
    { name: "Yoke", value: "yoke", denialCoefficient: 2 },
    { name: "Ancient Petsuit", value: "petsuit_ancient", denialCoefficient: 4 },
    { name: "Autotape Wrapping", value: "autotape_wrap", denialCoefficient: 2 },
    { name: "Latex Vacbed", value: "vacbed_latex", denialCoefficient: 3.5 },
    { name: "Doll Processing Facility", value: "doll_processing", denialCoefficient: 5 },
    { name: "Latex Vaccube", value: "vaccube_latex", denialCoefficient: 4.5 },
    { name: "Weighted Blanket", value: "blanket_weighted", denialCoefficient: 1.5 },
    // { name: "Silk Cocoon", value: "silk_cocoon", denialCoefficient: 2 },   Removed due to Arachnophobia
    { name: "Rope Boxtie", value: "rope_boxtie", denialCoefficient: 2 },
    { name: "Shadow Latex Ballsuit", value: "shadow_latex_ball", denialCoefficient: 4 },
    { name: "Latex Sphere", value: "sphere_latex", denialCoefficient: 3.5 },
    { name: "Binding Dress", value: "dress_binding", denialCoefficient: 4.5 },
    { name: "Hogtie", value: "rope_hogtie", denialCoefficient: 3 },
    { name: "Shrimp Tie", value: "rope_shrimp", denialCoefficient: 3 },
    { name: "Blanket Burrito", value: "blanket_burrito", denialCoefficient: 2 },
    { name: "Festive Ribbons", value: "ribbons_festive", denialCoefficient: 1.5 },
    { name: "Ribbons", value: "ribbons", denialCoefficient: 1.5 },
    { name: "Wrapping Paper", value: "wrapping_paper", denialCoefficient: 2 },
    { name: "Hardlight Cuffs (loose links)", value: "hardlight_looselink", denialCoefficient: 1.5 },
    { name: "Hardlight Cuffs (hogtie)", value: "hardlight_hogtie", denialCoefficient: 3 },
    { name: "Hardlight Cuffs (strict)", value: "hardlight_strict", denialCoefficient: 4.5 },
    { name: "Bed Restraints", value: "bedrestraints", denialCoefficient: 6 },
];


/**************
 * Discord API Requires an array of objects in form:
 * { name: "Latex Armbinder", value: "armbinder_latex" }
 ********************/
const loadHeavyTypes = () => {
    process.heavytypes = heavytypes.map((item) => {return {name: item.name, value: item.value}})
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

const assignHeavy = (user, type) => {
    if (process.heavy == undefined) { process.heavy = {} }
    process.heavy[user] = {
        type: convertheavy(type),
        typeval: type
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/heavyusers.txt`, JSON.stringify(process.heavy));
}

const getHeavy = (user) => {
    if (process.heavy == undefined) { process.heavy = {} }
    return process.heavy[user];
}

const removeHeavy = (user) => {
    if (process.heavy == undefined) { process.heavy = {} }
    delete process.heavy[user];
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/heavyusers.txt`, JSON.stringify(process.heavy));
}

exports.loadHeavyTypes = loadHeavyTypes
exports.heavytypes = heavytypes
exports.assignHeavy = assignHeavy
exports.getHeavy = getHeavy
exports.removeHeavy = removeHeavy
exports.commandsheavy = heavytypes
exports.convertheavy = convertheavy
exports.heavyDenialCoefficient = heavyDenialCoefficient;