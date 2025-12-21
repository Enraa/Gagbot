const fs = require('fs');
const path = require('path');
const https = require('https');

const heavytypes = [
    { name: "Latex Armbinder", value: "armbinder_latex" },
    { name: "Shadow Latex Armbinder", value: "armbinder_shadowlatex" },
    { name: "Wolfbinder", value: "armbinder_wolf" },
    { name: "Ancient Armbinder", value: "armbinder_ancient" },
    { name: "High Security Armbinder", value: "armbinder_secure" },
    { name: "Latex Boxbinder", value: "boxbinder_latex" },
    { name: "Comfy Straitjacket", value: "straitjacket_comfy" },
    { name: "Maid Straitjacket", value: "straitjacket_maid" },
    { name: "Maid Punishment Straitjacket", value: "straitjacket_maidpunishment" },
    { name: "Doll Straitjacket", value: "straitjacket_doll" },
    { name: "Black Hole Boxbinder", value: "boxbinder_blackhole" },
    { name: "Shadow Latex Petsuit", value: "petsuit_shadowlatex" },
    { name: "Bast Petsuit", value: "petsuit_bast" },
    { name: "Display Stand", value: "displaystand" },
    { name: "Latex Sleepsack", value: "sleepsack_latex" },
    { name: "Scavenger's Daughter", value: "scavengersdaughter" },
    { name: "Shadow Latex Straitjacket", value: "straitjacket_shadowlatex" },
    { name: "Dragon Queen Straps", value: "boxbinder_dragon" },
    { name: "Black Hole Armbinder", value: "armbinder_blackhole" },
    { name: "Crystal Armbinder", value: "armbinder_crystal" },
    { name: "Wolf Queenbinder", value: "armbinder_wolfqueen" },
    { name: "Leather Armbinder", value: "Armbinder_leather" },
    { name: "High-Security Boxbinder", value: "boxbinder_hisec" },
    { name: "Experimental Boxtie Binder", value: "boxbinder_experimental" },
    { name: "Leather Boxbinder", value: "boxbinder_leather" },
    { name: "Asylum Straitjacket", value: "straitjacket_asylum" },
    { name: "Black Hole Straitjacket", value: "straitjacket_blackhole" },
    { name: "Giant Pile of Plushies", value: "plushie_pile" },
    { name: "Lockdown Virus", value: "lockdown_virus" },
    { name: "Yoke", value: "yoke" },
    { name: "Ancient Petsuit", value: "petsuit_ancient" },
    { name: "Autotape Wrapping", value: "autotape_wrap" },
    { name: "Latex Vacbed", value: "vacbed_latex" },
    { name: "Doll Processing Facility", value: "doll_processing" },
    { name: "Latex Vaccube", value: "vaccube_latex" },
    { name: "Weighted Blanket", value: "blanket_weighted" },
    // { name: "Silk Cocoon", value: "silk_cocoon" },   Removed due to Arachnophobia
    { name: "Rope Boxtie", value: "rope_boxtie" },
    { name: "Shadow Latex Ballsuit", value: "shadow_latex_ball" },
    { name: "Latex Sphere", value: "sphere_latex" },
    { name: "Binding Dress", value: "dress_binding" },
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