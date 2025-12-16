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
    { name: "Maid Punishment Straitjacket", value: "straitjacket_maid" },
    { name: "Doll Straitjacket", value: "straitjacket_doll" },
    { name: "Black Hole Boxbinder", value: "boxbinder_blackhole" },
    { name: "Shadow Latex Petsuit", value: "petsuit_shadowlatex" },
    { name: "Bast Petsuit", value: "petsuit_bast" },
    { name: "Display Stand", value: "displaystand" },
    { name: "Latex Sleepsack", value: "sleepsack_latex" },
    { name: "Scavenger's Daughter", value: "scavengersdaughter" }
];

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

exports.assignHeavy = assignHeavy
exports.getHeavy = getHeavy
exports.removeHeavy = removeHeavy
exports.commandsheavy = heavytypes
exports.convertheavy = convertheavy