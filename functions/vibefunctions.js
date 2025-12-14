const fs = require('fs');
const path = require('path');
const https = require('https');

const assignChastity = (user, keyholder) => {
    if (process.chastity == undefined) { process.chastity = {} }
    process.chastity[user] = {
        keyholder: keyholder ? keyholder : "unlocked"
    }
    fs.writeFileSync(`./chastityusers.txt`, JSON.stringify(process.chastity));
}

const getChastity = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    return process.chastity[user];
}

const removeChastity = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    delete process.chastity[user];
    fs.writeFileSync(`./chastityusers.txt`, JSON.stringify(process.chastity));
}

const assignVibe = (user, intensity, vibetype = "bullet") => {
    if (process.vibe == undefined) { process.vibe = {} }
    process.vibe[user] = {
        vibetype: vibetype,
        intensity: intensity
    }
    fs.writeFileSync(`./vibeusers.txt`, JSON.stringify(process.vibe));
}

const setIntensity = (user, intensity) => {
    if (process.vibe == undefined) { process.vibe = {} }
    process.vibe[user].intensity = intensity
    fs.writeFileSync(`./vibeusers.txt`, JSON.stringify(process.vibe));
}

const getVibe = (user) => {
    if (process.vibe == undefined) { process.vibe = {} }
    return process.vibe[user];
}

const removeVibe = (user) => {
    if (process.vibe == undefined) { process.chastity = {} }
    delete process.vibe[user];
    fs.writeFileSync(`./vibeusers.txt`, JSON.stringify(process.vibe));
}

exports.assignChastity = assignChastity
exports.getChastity = getChastity
exports.removeChastity = removeChastity
exports.assignVibe = assignVibe
exports.setIntensity = setIntensity
exports.getVibe = getVibe
exports.removeVibe = removeVibe