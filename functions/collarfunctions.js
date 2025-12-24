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
    if (process.collar[user]) {
        process.collar[user].keyFindChance = 0.01;
        process.collar[user].oldKeyholder = process.collar[user].keyholder;
        process.collar[user].keyholder = "discarded";
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
}

const findCollarKey = (user, newKeyholder) => {
    if (process.collar == undefined) { process.collar = {} }
    if (process.collar[user]) {
        process.collar[user].keyholder = newKeyholder;
        process.collar[user].keyFindChance = null;
        process.collar[user].oldKeyholder = null;
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
}

const getFindableCollarKeys = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    const findable = [];
    for (const lockedUser in process.collar) {
        const data = process.collar[lockedUser];

        if ((data.keyFindChance ?? 0) > 0) {
            if (user == lockedUser || user == data.oldKeyholder) {
                findable.push([lockedUser, data.keyFindChance]);
            }

            // reduce chance to find keys for others
            if (optins.getAnyFinders(lockedUser)) {
                findable.push([lockedUser, data.keyFindChance / 10]);
            }
        }
    }

    return findable;
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
exports.getFindableCollarKeys = getFindableCollarKeys;
