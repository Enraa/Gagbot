const fs = require('fs');
const path = require('path');
const https = require('https');
const { arousedtexts, arousedtextshigh } = require('../vibes/aroused/aroused_texts.js')
const { optins } = require('./optinfunctions');
const { getHeavy, heavyDenialCoefficient } = require("./heavyfunctions.js");

// the arousal under which calculations get reset to avoid long back-calculations
const RESET_LIMT = 0.1;
// the minimum arousal required for frustration to also impact speach
const STUTTER_LIMIT = 1;
// the arousal needed for an unbelted user to orgasm
const ORGASM_LIMIT = 10;
// the coefficient for how much arousal is lost on orgasm
const RELEASE_STRENGTH = 16;
// the rate of arousal decay without orgasms when unbelted
const UNBELTED_DECAY = 0.05;
// the maximum frustration that can be reached
const MAX_FRUSTRATION = 100;
// the rate frustration grows at while belted
const FRUSTRATION_COEFFICIENT = 1.06;
// the portion of maximum frustration where the growth rate reduces
const FRUSTRATION_BREAKPOINT = 0.8;
const FRUSTRATION_BREAKPOINT_TIME = Math.log(FRUSTRATION_BREAKPOINT * MAX_FRUSTRATION) / Math.log(FRUSTRATION_COEFFICIENT);
// the rate frustration reaches the maximum after the breakpoint
const FRUSTRATION_MAX_COEFFICIENT = 7;
// the minimum time between successful orgasms
const ORGASM_COOLDOWN = 60 * 1000;

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

// Returns UNIX timestring of the wearer's unlock time. 
// second flag to true to return a Discord UNIX timestring instead. 
const getChastityTimelock = (user, UNIXTimestring) => {
    if (process.chastity == undefined) { process.chastity = {} }
    if (!UNIXTimestring) {
        return process.chastity[user]?.unlockTime
    }
    else {
        if (process.chastity[user]?.unlockTime) {
            return `<t:${Math.floor(process.chastity[user]?.unlockTime / 1000)}:f>`
        }
        else {
            return null
        }
    }
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

// Given a string, randomly provides a stutter and rarely provides an arousal text per word.
function stutterText(text, stutterChance) {
    function aux(text) {
        outtext = '';
        if (!((text.charAt(0) == "<" && text.charAt(1) == "@") || (text.charAt(0) == "\n") || (!text.charAt(0).match(/[a-zA-Z0-9]/)))) { //Ignore pings, linebreaks and signs (preventively I dunno)
            let stuttered = false;
            if (Math.random() < stutterChance) { // 2-20% to cause a stutter
                let stuttertimes = Math.max(Math.floor(Math.random() * 5 * stutterChance), 1) // Stutter between 1, 1-2 and 1-3 times, depending on intensity
                for (let i = 0; i < stuttertimes; i++) {
                    outtext = `${outtext}${text.charAt(0)}-`
                }
                outtext = `${outtext}${text}`
            }
            else {
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

// return of 0 = never, 1+ = always
function getStutterChance(user) {
  let chance = getArousal(user);
  if (chance < RESET_LIMT) chance = 0;
  if (chance >= STUTTER_LIMIT) {
    const chastity = getChastity(user);
    if (chastity) {
      const hoursBelted = (Date.now() - chastity.timestamp) / (60 * 60 * 1000);
      chance += calcFrustration(hoursBelted) / 10;
    }
  }
  return chance / 100;
}

function getArousalDescription(user) {
  const arousal = getArousal(user);
  const denialCoefficient = calcDenialCoefficient(user);
  const orgasmLimit = (UNBELTED_DECAY * ORGASM_LIMIT) / denialCoefficient;
  const orgasmProgress = arousal / orgasmLimit;
  // these numbers are mostly arbitrary
  if (orgasmProgress > 1.4) return "Overstimulated";
  if (orgasmProgress > 0.9) return "On edge";
  if (arousal < RESET_LIMT) return "Not aroused";
  if (arousal < ORGASM_LIMIT * 0.3) return "A bit aroused";
  if (arousal < ORGASM_LIMIT * 0.8) return "Moderately aroused";
  if (arousal < ORGASM_LIMIT * 1.5) return "Very aroused";
  return "Extremely aroused";
}

function getArousal(user) {
  if (process.arousal == undefined) process.arousal = {};
  const arousal = process.arousal[user] ?? { prev: 0, prev2: 0 };
  const now = Date.now();
  // skip calculating if last is recent
  if (now - arousal.timeStep < 1000) return arousal.prev;
  let timeStep = 1;
  if (arousal.timestamp && arousal.prev < RESET_LIMT) {
    timeStep = (now - arousal.timestamp) / (60 * 1000);
  }
  while (timeStep > 1) {
    const next = calcNextArousal(arousal.prev, arousal.prev2, calcGrowthCoefficient(user), calcDecayCoefficient(user), 1);
    arousal.prev2 = arousal.prev;
    arousal.prev = next;

    // abort loop early if arousal goes below the reset limit
    if (next < RESET_LIMT) {
      timeStep = 1;
      break;
    }

    timeStep -= 1;
  }
  const next = calcNextArousal(arousal.prev, arousal.prev2, calcGrowthCoefficient(user), calcDecayCoefficient(user), timeStep);
  arousal.prev2 = arousal.prev;
  arousal.prev = next;
  arousal.timestamp = now;
  process.arousal[user] = arousal;
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/arousal.txt`, JSON.stringify(process.arousal));
  return next;
}

function addArousal(user, change) {
  if (process.arousal == undefined) process.arousal = {};
  const arousal = process.arousal[user] ?? { prev: 0, prev2: 0 };
  const now = Date.now();
  // skip calculating if last is recent
  let next = arousal.prev + change;
  if (now - arousal.timeStep >= 1000) {
    let timeStep = 1;
    if (arousal.timestamp && arousal.prev < RESET_LIMT) {
      timeStep = (now - arousal.timestamp) / (60 * 1000);
    }
    // for large gaps, calculate it in steps
    while (timeStep > 1) {
      const next = calcNextArousal(arousal.prev, arousal.prev2, calcGrowthCoefficient(user), calcDecayCoefficient(user), 1);
      arousal.prev2 = arousal.prev;
      arousal.prev = next;

      // abort loop early if arousal goes below the reset limit
      if (next < RESET_LIMT) {
        timeStep = 1;
        break;
      }

      timeStep -= 1;
    }
    next = calcNextArousal(arousal.prev, arousal.prev2, calcGrowthCoefficient(user), calcDecayCoefficient(user), timeStep) + change;
    arousal.prev2 = arousal.prev;
    arousal.timestamp = now;
  }
  arousal.prev = next;
  process.arousal[user] = arousal;
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/arousal.txt`, JSON.stringify(process.arousal));
  return next;
}

function calcNextArousal(prev, prev2, growthCoefficient, decayCoefficient, timeStep) {
  const noDecay = prev + timeStep * growthCoefficient * Math.random();
  let next = noDecay - timeStep * decayCoefficient * (prev + prev2 / 2);
  return next;
}

// user attempts to orgasm, returns if it succeeds
function tryOrgasm(user) {
  const now = Date.now();
  const arousal = getArousal(user);
  const decayCoefficient = calcDecayCoefficient(user);
  const denialCoefficient = calcDenialCoefficient(user);
  const orgasmLimit = ORGASM_LIMIT;
  const releaseStrength = RELEASE_STRENGTH;
  const canOrgasm = now - (process.arousal[user]?.lastOrgasm ?? 0) >= ORGASM_COOLDOWN;

  if (canOrgasm && arousal.prev * (1 + Math.random()) / 2 >= (UNBELTED_DECAY * orgasmLimit) / denialCoefficient) {
    process.arousal[user].lastOrgasm = now;
    addArousal(user, -(decayCoefficient * decayCoefficient * releaseStrength * orgasmLimit) / UNBELTED_DECAY);
  }
}

// modify when more things affect it
function calcGrowthCoefficient(user) {
  const vibes = getVibe(user);
  if (!vibes) return 0;
  return vibes.reduce((a, b) => a + b.intensity, 0) / 10;
}

// modify when more things affect it
function calcDecayCoefficient(user) {
  return getChastity(user) ? UNBELTED_DECAY / 5 : UNBELTED_DECAY;
}

// modify when more things affect it
function calcDenialCoefficient(user) {
  const heavy = getHeavy(user);
  if (getChastity(user)) return (heavy ? heavyDenialCoefficient(heavy.typeval) : 0) / 2 + 5;
  return heavy ? heavyDenialCoefficient(heavy.typeval) : 1;
}

// modify when more things affect it
function calcFrustration(hoursBelted) {
  if (hoursBelted <= FRUSTRATION_BREAKPOINT_TIME) {
    return Math.pow(FRUSTRATION_COEFFICIENT, hoursBelted);
  }

  const unbounded = MAX_FRUSTRATION * FRUSTRATION_BREAKPOINT + FRUSTRATION_MAX_COEFFICIENT * Math.log10(hoursBelted - FRUSTRATION_BREAKPOINT_TIME + 1);

  if (unbounded > MAX_FRUSTRATION) return MAX_FRUSTRATION;
  return unbounded;
}

exports.getStutterChance = getStutterChance;
exports.getArousalDescription = getArousalDescription;
exports.calcFrustration = calcFrustration;
exports.getArousal = getArousal;
exports.addArousal = addArousal;
exports.tryOrgasm = tryOrgasm;

exports.assignChastity = assignChastity
exports.getChastity = getChastity
exports.removeChastity = removeChastity
exports.assignVibe = assignVibe
exports.getVibe = getVibe
exports.removeVibe = removeVibe
exports.stutterText = stutterText
exports.getChastityTimelock = getChastityTimelock

exports.getChastityKeys = getChastityKeys;
exports.getChastityKeyholder = getChastityKeyholder;
exports.transferChastityKey = transferChastityKey
exports.discardChastityKey = discardChastityKey;
exports.findChastityKey = findChastityKey;
exports.getFindableChastityKeys = getFindableChastityKeys;

console.log(getChastityKeys("125093095405518850"))
