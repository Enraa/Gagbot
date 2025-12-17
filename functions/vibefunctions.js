const fs = require('fs');
const path = require('path');
const https = require('https');
const { arousedtexts, arousedtextshigh } = require('../vibes/aroused/aroused_texts.js')
const { getArousal, getStutterChance } = require('./arousal');
const { optins } = require('./optinfunctions');

const assignChastity = (user, keyholder) => {
    if (process.chastity == undefined) { process.chastity = {} }
    // catch up with arousal before arousal-affecting restraints change
    getArousal(user);
    process.chastity[user] = {
        keyholder: keyholder ? keyholder : "unlocked",
        timestamp: Date.now()
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
}

const getChastity = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    return process.chastity[user];
}

const removeChastity = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    // catch up with arousal before arousal-affecting restraints change
    getArousal(user);
    delete process.chastity[user];
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
}

const assignVibe = (user, intensity, vibetype = "bullet vibe") => {
    if (process.vibe == undefined) { process.vibe = {} }
    // catch up with arousal before arousal-affecting restraints change
    getArousal(user);
    if (!process.vibe[user]) {        
        process.vibe[user] = [{
            vibetype: vibetype,
            intensity: intensity
        }]
    } else {
        const existingVibe = process.vibe[user].find(v => v.vibetype === vibetype);
        if (existingVibe) {
            existingVibe.intensity = intensity;
        } else {
            process.vibe[user].push({
                vibetype: vibetype,
                intensity: intensity
            });
        }
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/vibeusers.txt`, JSON.stringify(process.vibe));
}

const getVibe = (user) => {
    if (process.vibe == undefined) { process.vibe = {} }
    return process.vibe[user];
}

const removeVibe = (user, vibetype) => {
    if (process.vibe == undefined) { process.vibe = {} }
    // catch up with arousal before arousal-affecting restraints change
    getArousal(user);
    if (!vibetype) {
        delete process.vibe[user];
    } else {
        process.vibe[user] = process.vibe[user].filter(v => v.vibetype !== vibetype);
        if (process.vibe[user].length == 0) {
            delete process.vibe[user]; // Discard the vibes object as we are no longer using it. 
        }
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/vibeusers.txt`, JSON.stringify(process.vibe));
}

const getChastityKeys = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    let keysheld = [];
    Object.keys(process.chastity).forEach((k) => {
        if (process.chastity[k].keyholder == user) {
            keysheld.push(k)
        }
    })
    return keysheld
}

const getChastityKeyholder = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    return process.chastity[user]?.keyholder;
}

// transfer keys and returns whether the transfer was successful
const transferChastityKey = (lockedUser, newKeyholder) => {
    if (process.chastity == undefined) { process.chastity = {} }
    if (process.chastity[lockedUser]) {
        if (process.chastity[lockedUser].keyholder != newKeyholder) {
            process.chastity[lockedUser].keyholder = newKeyholder;
            fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
            return true;
        }
    }

    return false;
}

const discardChastityKey = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    if (process.chastity[user]) {
        process.chastity[user].keyFindChance = 0.01;
        process.chastity[user].oldKeyholder = process.chastity[user].keyholder;
        process.chastity[user].keyholder = "discarded";
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
}

const findChastityKey = (user, newKeyholder) => {
    if (process.chastity == undefined) { process.chastity = {} }
    if (process.chastity[user]) {
        process.chastity[user].keyholder = newKeyholder;
        process.chastity[user].keyFindChance = null;
        process.chastity[user].oldKeyholder = null;
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
}

const getFindableChastityKeys = (user) => {
    if (process.chastity == undefined) { process.chastity = {} }
    const findable = [];
    for (const lockedUser in process.chastity) {
        const data = process.chastity[lockedUser];

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

const arousedtexts = [
  "ah~", "mm~", "ahh~", "mmm~", "ooh!~",
  "mmmf~", "aah! <3", "aaahh!~", "mmm!~ <3", "aahhhhh!~",
  "oooohhff!!~", "aaahaahhh!~", "mmmff~  so good...", "oohf!~  t-thank youuu~  <3", "ahh mmf ahhh!!!~",
  "mmff more... aahh!!~"
]
const arousedtextshigh = [
  "MMMM~ <3", "OOOOHHHF~", "AAHHH!!~",
  "AAH! YES!~", "MMMFF...  MORE PLEAASEEE!!~", "MMMFFF AAHH AAHHHH!!!~  <3"
]

// Given a string, randomly provides a stutter and rarely provides an arousal text per word.
const stutterText = (text, userid) => {
    const stutterChance = getStutterChance(userid);
    let outtext = `${text}`;
    if (Math.random() < stutterChance) { // 2-20% to cause a stutter
        let stuttertimes = Math.max(Math.floor(Math.random() * 3 * stutterChance), 1) // Stutter between 1, 1-2 and 1-3 times, depending on intensity
        outtext = '';
        for (let i = 0; i < stuttertimes; i++) {
            outtext = `${outtext}${text.charAt(0)}-`
        }
        outtext = `${outtext}${text}`
    }
    if (Math.random() < stutterChance / 4) { // 0.5-5% to insert an arousal text
        let arousedlist = arousedtexts;
        if (stutterChance > 0.7) {
            for (let i = 0; i < arousedtextshigh; i++) { // Remove the first 5 elements to give the high arousal texts higher chance to show up
                arousedlist[i] = arousedtextshigh[i]
            }
        }
        let arousedtext = arousedtexts[Math.floor(Math.random() * arousedtexts.length)]
        outtext = `${outtext}${arousedtext}`
    }
    return outtext
}

function stutterText(text, intensity=5) {
    function aux(text) {
        outtext = '';
        if (!((text.charAt(0) == "<" && text.charAt(1) == "@") || 
            (text.charAt(0) == "\n") || 
            (!text.charAt(0).match(/[a-zA-Z0-9]/)))) { //Ignore pings, linebreaks and signs (preventively I dunno)

            if (Math.random() > (1.0 - (0.2 * intensity))) { // 2-20% to cause a stutter
                let stuttertimes = Math.max(Math.floor(Math.random() * (0.3 * intensity)), 1) // Stutter between 1, 1-2 and 1-3 times, depending on intensity
                for (let i = 0; i < stuttertimes; i++) {
                    outtext = `${outtext}${text.charAt(0)}-`
                }
                outtext = `${outtext}${text}`
            }
            if (Math.random() > (1.0 - (0.05 * intensity))) { // 0.5-5% to insert an arousal text
                let arousedlist = arousedtexts;
                if (intensity > 7) {
                    for (let i = 0; i < arousedtextshigh; i++) { // Remove the first 5 elements to give the high arousal texts higher chance to show up
                        arousedlist[i] = arousedtextshigh[i]
                    }
                }
                let arousedtext = arousedtexts[Math.floor(Math.random() * arousedtexts.length)]
                outtext = `${outtext} ${arousedtext}`
            }
            return outtext;
        } else {
            return text;
        }
    }
    
    let newtextparts = text.split(" ");
    let outtext = ''
    for (let i = 0; i < newtextparts.length; i++) {
        outtext = `${outtext} ${aux(newtextparts[i])}`
    }
    return outtext
}

exports.assignChastity = assignChastity
exports.getChastity = getChastity
exports.removeChastity = removeChastity
exports.assignVibe = assignVibe
exports.getVibe = getVibe
exports.removeVibe = removeVibe
exports.stutterText = stutterText

exports.getChastityKeys = getChastityKeys;
exports.getChastityKeyholder = getChastityKeyholder;
exports.transferChastityKey = transferChastityKey
exports.discardChastityKey = discardChastityKey;
exports.findChastityKey = findChastityKey;
exports.getFindableChastityKeys = getFindableChastityKeys;

console.log(getChastityKeys("125093095405518850"))
