const fs = require('fs');
const path = require('path');
const https = require('https');
const { optins } = require('./optinfunctions');

const collartypes = [
    { name: "Latex Collar", value: "collar_latex" },
    { name: "Leather Collar", value: "collar_leather" },
    { name: "Cyber Doll Collar", value: "collar_cyberdoll" },
    { name: "Hardlight Collar", value: "collar_hardlight" },
    { name: "Runic Collar", value: "collar_runic" },
    { name: "Tall Posture Collar", value: "collar_posture" },
    { name: "Ruffled Maid Collar", value: "collar_maid" },
    { name: "Nevermere Tracking Collar", value: "collar_nevermere" },
    { name: "Steel Collar", value: "collar_steel" },
    { name: "Kitty Collar", value: "collar_kitty" },
    { name: "Sheep Collar", value: "collar_sheep" },
    { name: "Potion Collar", value: "collar_potion" },
]

const assignCollar = (user, keyholder, restraints, only, customcollar) => {
    if (process.collar == undefined) { process.collar = {} }
    process.collar[user] = {
        keyholder: keyholder,
        keyholder_only: only,
        mitten: restraints.mitten,
        chastity: restraints.chastity,
        heavy: restraints.heavy,
        collartype: customcollar
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
}

const getCollar = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    return process.collar[user];
}

const getCollarPerm = (user, perm) => {
    if (process.collar == undefined) { process.collar = {} }
    return process.collar[user][perm];
}

const removeCollar = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    delete process.collar[user];
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
}

const getCollarKeys = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    let keysheld = [];
    Object.keys(process.collar).forEach((k) => {
        if (process.collar[k].keyholder == user) {
            keysheld.push(k)
        }
    })
    return keysheld
}

const getCollarName = (userID, collarname) => {
    if (process.collar == undefined) { process.collar = {} }
    let convertcollararr = {}
    for (let i = 0; i < collartypes.length; i++) {
        convertcollararr[collartypes[i].value] = collartypes[i].name
    }
    if (collarname) {
        return convertcollararr[collarname];
    }
    else if (process.collar[userID]?.collartype) {
        return convertcollararr[process.collar[userID]?.collartype]
    }
    else {
        return undefined;
    }
}

const getCollarKeyholder = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    return process.collar[user]?.keyholder;
}

// transfer keys and returns whether the transfer was successful
const transferCollarKey = (lockedUser, newKeyholder) => {
    if (process.collar == undefined) { process.collar = {} }
    if (process.collar[lockedUser]) {
        if (process.collar[lockedUser].keyholder != newKeyholder) { 
            process.collar[lockedUser].keyholder = newKeyholder;
            fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
            return true;
        }
    }

    return false;
}

const discardCollarKey = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    if (process.discardedKeys == undefined) { process.discardedKeys = [] }
    if (process.collar[user]) {
        process.collar[user].keyholder = "discarded";
        process.discardedKeys.push({
          restraint: "collar",
          wearer: user
        })
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/discardedkeys.txt`, JSON.stringify(process.discardedKeys));
}

const findCollarKey = (index, newKeyholder) => {
    if (process.collar == undefined) { process.collar = {} }
    if (process.discardedKeys == undefined) { process.discardedKeys = [] }
    const collar = process.discardedKeys.splice(index, 1);
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/discardedkeys.txt`, JSON.stringify(process.discardedKeys));
    if (collar.length < 1) return false;
    if (process.collar[collar[0].wearer]) {
      process.collar[collar[0].wearer].keyholder = newKeyholder;
      fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
      return true;
    }
    return false;
}

exports.assignCollar = assignCollar
exports.getCollar = getCollar
exports.removeCollar = removeCollar
exports.getCollarKeys = getCollarKeys
exports.getCollarKeyholder = getCollarKeyholder;
exports.transferCollarKey = transferCollarKey
exports.getCollarPerm = getCollarPerm
exports.discardCollarKey = discardCollarKey;
exports.findCollarKey = findCollarKey;
exports.getCollarName = getCollarName;
exports.getCollarName = getCollarName;
exports.collartypes = collartypes;
