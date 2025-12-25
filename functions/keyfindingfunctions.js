const { getFindableCollarKeys, findCollarKey } = require("./collarfunctions");
const { getFindableChastityKeys, findChastityKey, getChastity, getArousal, calcFrustration } = require("./vibefunctions");
const { their } = require("./pronounfunctions");
const { getMitten } = require("./gagfunctions");
const { optins } = require("./optinfunctions");
const fs = require("fs");
const { getUserVar, setUserVar } = require("./usercontext");
const { getHeavy } = require("./heavyfunctions");

// the minimum time before attempts at using keys can succeed after they fumble
const MIN_FUMBLE_TIMEOUT = 60000;
// the maximum time before attempts at using keys can succeed after they fumble
const MAX_FUMBLE_TIMEOUT = 180000;
// the minimum time between messages from a user that can find keys
const KEYFINDING_COOLDOWN = 60 * 1000;

// return true if the user fumbles
function rollKeyFumble(keyholder, locked) {
  if (process.keyfumbling == undefined) {
    process.keyfumbling = {};
  }
  const now = Date.now();
  const fumbleChance = getFumbleChance(keyholder, locked);
  if (!fumbleChance) return false;
  if (process.keyfumbling[keyholder]?.timeoutEnd > now) {
    process.keyfumbling[keyholder].timeoutEnd += MIN_FUMBLE_TIMEOUT + Math.floor(Math.random() * (MAX_FUMBLE_TIMEOUT - MIN_FUMBLE_TIMEOUT));
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`, JSON.stringify(process.keyfumbling));
    return true;
  }
  if (Math.random() < fumbleChance) {
    if (optins.getBlessedLuck(keyholder)) {
      if (process.keyfumbling[keyholder]?.blessing) process.keyfumbling[keyholder].blessing += 1 - fumbleChance;
      else process.keyfumbling[keyholder].blessing = 1 - fumbleChance;
      fs.writeFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`, JSON.stringify(process.keyfumbling));
    }
    process.keyfumbling[keyholder] = {
      timeoutEnd: now + MIN_FUMBLE_TIMEOUT + Math.floor(Math.random() * (MAX_FUMBLE_TIMEOUT - MIN_FUMBLE_TIMEOUT)),
    };
    return true;
  } else {
    if (process.keyfumbling[keyholder]?.blessing) process.keyfumbling[keyholder].blessing = 0;
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`, JSON.stringify(process.keyfumbling));
    return false;
  }
}

// use this if the same action causes multiple rolls to not trigger timeout before being done
function rollKeyFumbleN(keyholder, locked, n) {
  if (process.keyfumbling == undefined) {
    process.keyfumbling = {};
  }
  const now = Date.now();
  const fumbleChance = getFumbleChance(keyholder, locked);
  if (!fumbleChance) return Array(n).fill(false);
  if (process.keyfumbling[keyholder]?.timeoutEnd > now) {
    process.keyfumbling[keyholder].timeoutEnd += MIN_FUMBLE_TIMEOUT + Math.floor(Math.random() * (MAX_FUMBLE_TIMEOUT - MIN_FUMBLE_TIMEOUT));
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`, JSON.stringify(process.keyfumbling));
    return Array(n).fill(true);
  }
  const results = [];
  for (let i = 0; i < n; i++) {
    if (Math.random() < fumbleChance) {
      if (optins.getBlessedLuck(keyholder)) {
        if (process.keyfumbling[keyholder]?.blessing) process.keyfumbling[keyholder].blessing += 1 - fumbleChance;
        else process.keyfumbling[keyholder].blessing = 1 - fumbleChance;
      }
      results[i] = true;
      process.keyfumbling[keyholder] = {
        timeoutEnd: now + MIN_FUMBLE_TIMEOUT + Math.floor(Math.random() * (MAX_FUMBLE_TIMEOUT - MIN_FUMBLE_TIMEOUT)),
      };
    } else {
      if (process.keyfumbling[keyholder]?.blessing) process.keyfumbling[keyholder].blessing = 0;
      results[i] = false;
    }
  }

  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`, JSON.stringify(process.keyfumbling));
  return results;
}

// return of 0 = never, 1+ = always
function getFumbleChance(keyholder, locked) {
  if (process.keyfumbling == undefined) {
    process.keyfumbling = {};
  }
  if (!optins.getDynamicArousal(keyholder)) return 0;
  if (!optins.getKeyFumbling(keyholder)) return 0;
  if (keyholder != locked && !optins.getFumbleOthersKeys(keyholder)) return 0;
  if (keyholder != locked && !optins.getOthersKeyFumbling(locked)) return 0;
  let chance = getArousal(keyholder) * 2;
  const chastity = getChastity(keyholder);
  if (chastity) {
    const hoursBelted = (Date.now() - chastity.timestamp) / (60 * 60 * 1000);
    chance += calcFrustration(hoursBelted);
    chance += chastity.extraFrustration ?? 0;
  }

  // chance is increased if the keyholder is wearing mittens
  if (getMitten(keyholder)) {
    chance += 10;
    chance *= 1.1;
  }

  if (chance < 100 && optins.getBlessedLuck(keyholder)) {
    chance -= process.keyfumbling[keyholder]?.blessing ?? 0;
  }

  // divine intervention
  if (chance < 100 && Math.random() < 0.02) chance -= 50;

  return chance / 100;
}

async function handleKeyFinding(message) {
  const now = Date.now();
  if (now - (getUserVar(message.author.id, "lastKeyFindTimestamp") ?? 0) < KEYFINDING_COOLDOWN) return;
  setUserVar(message.author.id, "lastKeyFindTimestamp", now);

  const findSuccessChance = calcFindSuccessChance(message.author.id);
  const findableKeys = [];

  for ([lockedUser, chance] of getFindableChastityKeys(message.author.id)) findableKeys.push([lockedUser, chance, findChastityKey, "chastity belt"]);
  for ([lockedUser, chance] of getFindableCollarKeys(message.author.id)) findableKeys.push([lockedUser, chance, findCollarKey, "collar"]);

  shuffleArray(findableKeys);

  for ([lockedUser, chance, findFunction, restraint] of findableKeys) {
    if (Math.random() < chance) {
      if (Math.random() < findSuccessChance) {
        sendFindMessage(message, lockedUser, restraint);
        findFunction(lockedUser, message.author.id);
        return;
      } else {
        sendFindFumbleMessage(message, lockedUser, restraint);
        return;
      }
    }
  }
}

async function sendFindMessage(message, lockedUser, restraint) {
  if (message.author.id == lockedUser) message.channel.send(`${message.author} has found the key to ${their(message.author.id)} ${restraint}!`);
  else message.channel.send(`${message.author} has found the key to <@${lockedUser}>'s ${restraint}!`);
}

async function sendFindFumbleMessage(message, lockedUser, restraint) {
  if (message.author.id == lockedUser) message.channel.send(`${message.author} has found the key to ${their(message.author.id)} ${restraint} but fumbles when trying to pick it up!`);
  else message.channel.send(`${message.author} has found the key to <@${lockedUser}>'s ${restraint} but fumbles when trying to pick it up!`);
}

function calcFindSuccessChance(user) {
  if (getHeavy(user)) return 0;
  if (getMitten(user)) return 0.5;
  else return 1;
}

// Durstenfeld shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

exports.getFumbleChance = getFumbleChance;
exports.rollKeyFumble = rollKeyFumble;
exports.rollKeyFumbleN = rollKeyFumbleN;
exports.handleKeyFinding = handleKeyFinding;
