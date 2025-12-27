const fs = require('fs');
const path = require('path');
const https = require('https');
const { arousedtexts, arousedtextshigh } = require('../vibes/aroused/aroused_texts.js')
const { optins } = require('./optinfunctions');
const { getHeavy, heavyDenialCoefficient } = require("./heavyfunctions.js");

// the arousal under which it is treated as 0
const RESET_LIMIT = 0.1;
// the minimum arousal required for frustration to also impact speach
const STUTTER_LIMIT = 1;
// the arousal needed for an unbelted user to orgasm
const ORGASM_LIMIT = 10;
// the rate of arousal decay without orgasms when unbelted
const UNBELTED_DECAY = 0.2;
// the maximum frustration that can be reached
const MAX_FRUSTRATION = 100;
// by how much arousal randomness is biased upwards
const RANDOM_BIAS = 1;
// by how much vibe intensity is scaled for the arousal model
const VIBE_SCALING = 0.6;
// the rate frustration grows at while belted
const FRUSTRATION_COEFFICIENT = 1.06;
// the portion of maximum frustration where the growth rate reduces
const FRUSTRATION_BREAKPOINT = 0.8;
const FRUSTRATION_BREAKPOINT_TIME = Math.log(FRUSTRATION_BREAKPOINT * MAX_FRUSTRATION) / Math.log(FRUSTRATION_COEFFICIENT);
// the rate frustration reaches the maximum after the breakpoint
const FRUSTRATION_MAX_COEFFICIENT = 7;
// the minimum time between successful orgasms
const ORGASM_COOLDOWN = 60 * 1000;
// the frustration increase caused by failed orgasms
const ORGASM_FRUSTRATION = 5;

const assignChastity = (user, keyholder) => {
    if (process.chastity == undefined) { process.chastity = {} }
    // catch up with arousal before arousal-affecting restraints change
    getArousal(user);
    process.chastity[user] = {
        keyholder: keyholder ? keyholder : "unlocked",
        timestamp: Date.now(),
        extraFrustration: 0,
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
    if (!optins.getEnableVibes(user)) return;
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
    if (process.discardedKeys == undefined) { process.discardedKeys = [] }
    if (process.chastity[user]) {
        process.chastity[user].keyholder = "discarded";
        process.discardedKeys.push({
          restraint: "chastity belt",
          wearer: user
        })
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/discardedkeys.txt`, JSON.stringify(process.discardedKeys));
}

const findChastityKey = (index, newKeyholder) => {
    if (process.chastity == undefined) { process.chastity = {} }
    if (process.discardedKeys == undefined) { process.discardedKeys = [] }
    const chastity = process.discardedKeys.splice(index, 1);
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/discardedkeys.txt`, JSON.stringify(process.discardedKeys));
    if (chastity.length < 1) return false;
    if (process.chastity[chastity[0].wearer]) {
      process.chastity[chastity[0].wearer].keyholder = newKeyholder;
      fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
      return true;
    }
    return false;
}

// Given a string, randomly provides a stutter and rarely provides an arousal text per word.
function stutterText(text, intensity) {
    function aux(text) {
        outtext = '';
        if (!((text.charAt(0) == "<" && text.charAt(1) == "@") || (text.charAt(0) == "\n") || (!text.charAt(0).match(/[a-zA-Z0-9]/)))) { //Ignore pings, linebreaks and signs (preventively I dunno)
            let stuttered = false;
            console.log("a");console.log(text);console.log(intensity);
            if (Math.random() < intensity / 10) { // 2-20% to cause a stutter
                let stuttertimes = Math.min(Math.max(Math.floor(Math.random() * 0.3 * intensity), 1), 8) // Stutter between 1, 1-2 and 1-3 times, depending on intensity
                for (let i = 0; i < stuttertimes; i++) {
                    outtext = `${outtext}${text.charAt(0)}-`
                }
                outtext = `${outtext}${text}`
            }
            else {
                outtext = `${outtext}${text}`
            }
            if (Math.random() < intensity / 40) { // 0.5-5% to insert an arousal text
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

function getVibeEquivalent(user) {
  if (!optins.getDynamicArousal(user)) return calcStaticVibeIntensity(user);

  let intensity = getArousal(user);
  if (intensity < RESET_LIMIT) intensity = 0;
  if (intensity >= STUTTER_LIMIT) {
    const chastity = getChastity(user);
    if (chastity) {
      const hoursBelted = (Date.now() - chastity.timestamp) / (60 * 60 * 1000);
      intensity += (calcFrustration(hoursBelted) + (chastity.extraFrustration ?? 0)) / 10;
    }
  }
  return intensity;
}

function getArousalDescription(user) {
  if (!optins.getDynamicArousal(user)) return null;

  const arousal = getArousal(user);
  const denialCoefficient = calcDenialCoefficient(user);
  const orgasmLimit = ORGASM_LIMIT * denialCoefficient;
  const orgasmProgress = arousal / orgasmLimit;
  // these numbers are mostly arbitrary
  if (orgasmProgress > 1.4) return "Overstimulated";
  if (orgasmProgress > 0.9) return "On edge";
  if (arousal < RESET_LIMIT) return "Not aroused";
  if (arousal < ORGASM_LIMIT * 0.3) return "A bit aroused";
  if (arousal < ORGASM_LIMIT * 0.8) return "Moderately aroused";
  if (arousal < ORGASM_LIMIT * 1.5) return "Very aroused";
  return "Extremely aroused";
}

function getArousalChangeDescription(user) {
  if (!optins.getDynamicArousal(user)) return null;

  if (process.arousal == undefined) process.arousal = {};
  const arousal = process.arousal[user];
  if (!arousal || !arousal.lastChange || !arousal.lastTimeStep) return null;
  const lastChange = arousal.lastChange / arousal.lastTimeStep * arousal.prev;
  if (Math.abs(lastChange) < 0.01) return null;
  // these numbers are mostly arbitrary
  if (lastChange < -2) return "and cooling off rapidly";
  if (lastChange < 0) return "and cooling off";
  if (lastChange < 2) return "and getting a little turned on";
  if (lastChange < ORGASM_LIMIT * 5) return "and getting very hot";
  return "and rushing to the peaks";
}

function getArousal(user) {
  if (process.arousal == undefined) process.arousal = {};
  const arousal = process.arousal[user] ?? { prev: 0, prev2: 0 };
  const now = Date.now();
  if (arousal.timestamp && arousal.timestamp > now) return arousal.prev;
  let timeStep = 1;
  if (arousal.timestamp) {
    timeStep = (now - arousal.timestamp) / (60 * 1000);
  }
  while (timeStep > 1) {
    const next = calcNextArousal(arousal.prev, arousal.prev2, calcGrowthCoefficient(user), calcDecayCoefficient(user), 1);
    arousal.prev2 = arousal.prev;
    arousal.prev = next;
    timeStep -= 1;
  }
  const next = calcNextArousal(arousal.prev, arousal.prev2, calcGrowthCoefficient(user), calcDecayCoefficient(user), timeStep);
  arousal.lastChange = next - arousal.prev;
  arousal.lastTimeStep = timeStep;
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
  if (arousal.timestamp && arousal.timestamp > now) {
    arousal.prev += change;
    return arousal.prev;
  }
  let timeStep = 1;
  if (arousal.timestamp) {
    timeStep = (now - arousal.timestamp) / (60 * 1000);
  }
  // for large gaps, calculate it in steps
  while (timeStep > 1) {
    const next = calcNextArousal(arousal.prev, arousal.prev2, calcGrowthCoefficient(user), calcDecayCoefficient(user), 1);
    arousal.prev2 = arousal.prev;
    arousal.prev = next;
    timeStep -= 1;
  }
  const next = calcNextArousal(arousal.prev, arousal.prev2, calcGrowthCoefficient(user), calcDecayCoefficient(user), timeStep) + change;
  arousal.lastChange = next - arousal.prev;
  arousal.lastTimeStep = timeStep;
  arousal.prev2 = arousal.prev;
  arousal.timestamp = now;
  arousal.prev = next;
  process.arousal[user] = arousal;
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/arousal.txt`, JSON.stringify(process.arousal));
  return next;
}

function clearArousal(user) {
  if (process.arousal == undefined) process.arousal = {};
  process.arousal[user] = { prev: 0, prev2: 0, timestamp: Date.now(), lastOrgasm: 0 };
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/arousal.txt`, JSON.stringify(process.arousal));
}

function calcNextArousal(prev, prev2, growthCoefficient, decayCoefficient, timeStep) {
  const noDecay = prev + timeStep * growthCoefficient * (RANDOM_BIAS + Math.random()) / (RANDOM_BIAS + 1);
  const next = noDecay - timeStep * decayCoefficient * Math.max((prev + prev2 / 2), 0.1);
  return next;
}

// user attempts to orgasm, returns if it succeeds
function tryOrgasm(user) {
  // always succeed if user isnt using the system
  if (!optins.getDynamicArousal(user)) return true;

  const now = Date.now();
  const arousal = getArousal(user);
  const denialCoefficient = calcDenialCoefficient(user);
  const orgasmLimit = ORGASM_LIMIT;
  const canOrgasm = true; // now - (process.arousal[user]?.lastOrgasm ?? 0) >= ORGASM_COOLDOWN;

  if (canOrgasm && arousal * (RANDOM_BIAS + Math.random()) / (RANDOM_BIAS + 1) >= orgasmLimit * denialCoefficient) {
    process.arousal[user].lastOrgasm = now;
    setArousalCooldown(user)
    const chastity = getChastity(user);
    if (chastity) {
      chastity.extraFrustration = 0;
      chastity.timestamp = (chastity.timestamp + now) / 2;
      fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
    }
    return true;
  }

  // failing to orgasm is frustrating
  const chastity = getChastity(user);
  if (chastity) {
    const extraFrustration = chastity.extraFrustration ?? 0;
    chastity.extraFrustration = extraFrustration + ORGASM_FRUSTRATION;
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
  }

  return false;
}

function setArousalCooldown(user) {
  const now = Date.now();
  process.arousal[user].timestamp = now + ORGASM_COOLDOWN;
  process.arousal[user].prev = 0;
  process.arousal[user].prev2 = 0;
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/arousal.txt`, JSON.stringify(process.arousal));
}

// modify when more things affect it
function calcGrowthCoefficient(user) {
  const vibes = getVibe(user);
  if (!vibes) return 0;
  return vibes.reduce((a, b) => a + b.intensity, 0) * VIBE_SCALING;
}

// modify when more things affect it
function calcStaticVibeIntensity(user) {
  const vibes = getVibe(user);
  if (!vibes) return 0;
  return vibes.reduce((a, b) => a + b.intensity, 0);
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

exports.getVibeEquivalent = getVibeEquivalent;
exports.getArousalDescription = getArousalDescription;
exports.getArousalChangeDescription = getArousalChangeDescription;
exports.calcFrustration = calcFrustration;
exports.getArousal = getArousal;
exports.addArousal = addArousal;
exports.clearArousal = clearArousal;
exports.tryOrgasm = tryOrgasm;
exports.setArousalCooldown = setArousalCooldown;

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

console.log(getChastityKeys("125093095405518850"))
