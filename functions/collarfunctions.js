const fs = require('fs');
const path = require('path');
const https = require('https');
const { optins } = require('./optinfunctions');

const assignCollar = (user, keyholder, restraints, only) => {
    if (process.collar == undefined) { process.collar = {} }
    process.collar[user] = {
        keyholder: keyholder,
        keyholder_only: only,
        mitten: restraints.mitten,
        chastity: restraints.chastity,
        heavy: restraints.heavy
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
