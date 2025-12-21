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
    { name: "Maid Punishment Straitjacket", value: "straitjacket_maid", denialCoefficient: 4 },
    { name: "Doll Straitjacket", value: "straitjacket_doll", denialCoefficient: 3.5 },
    { name: "Black Hole Boxbinder", value: "boxbinder_blackhole", denialCoefficient: 2 },
    { name: "Shadow Latex Petsuit", value: "petsuit_shadowlatex", denialCoefficient: 3 },
    { name: "Bast Petsuit", value: "petsuit_bast", denialCoefficient: 3 },
    { name: "Display Stand", value: "displaystand", denialCoefficient: 4 },
    { name: "Latex Sleepsack", value: "sleepsack_latex", denialCoefficient: 4 },
    { name: "Scavenger's Daughter", value: "scavengersdaughter", denialCoefficient: 4 }
];

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

exports.assignHeavy = assignHeavy
exports.getHeavy = getHeavy
exports.removeHeavy = removeHeavy
exports.commandsheavy = heavytypes
exports.convertheavy = convertheavy
exports.heavyDenialCoefficient = heavyDenialCoefficient;