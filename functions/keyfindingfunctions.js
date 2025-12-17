const { getFindableCollarKeys, findCollarKey } = require("./collarfunctions");
const { getFindableChastityKeys, findChastityKey, getChastity, getArousal, calcFrustration } = require("./vibefunctions");
const { their } = require("./pronounfunctions");
const { getMitten } = require("./gagfunctions");
const { optins } = require("./optinfunctions");
const fs = require("fs");

const MIN_FUMBLE_TIMEOUT = 60000;
const MAX_FUMBLE_TIMEOUT = 180000;

// return true if the user fumbles
function rollKeyFumble(user) {
  if (process.keyfumbling == undefined) {
    process.keyfumbling = {};
  }
  const now = Date.now();
  if (process.keyfumbling[user]?.timeoutEnd > now) {
    process.keyfumbling[user].timeoutEnd += MIN_FUMBLE_TIMEOUT + Math.floor(Math.random() * (MAX_FUMBLE_TIMEOUT - MIN_FUMBLE_TIMEOUT));
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`, JSON.stringify(process.keyfumbling));
    return true;
  } else {
    process.keyfumbling[user] = {
      timeoutEnd: now + MIN_FUMBLE_TIMEOUT + Math.floor(Math.random() * (MAX_FUMBLE_TIMEOUT - MIN_FUMBLE_TIMEOUT)),
    };
  }
  const fumbleChance = getFumbleChance(user);
  if (Math.random() < fumbleChance) {
    if (optins.getBlessedLuck(user)) {
      if (process.keyfumbling[user]?.blessing) process.keyfumbling[user].blessing += 1 - fumbleChance;
      else process.keyfumbling[user].blessing = 1 - fumbleChance;
      fs.writeFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`, JSON.stringify(process.keyfumbling));
    }
    return true;
  } else {
    if (process.keyfumbling[user]?.blessing) process.keyfumbling[user].blessing = 0;
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`, JSON.stringify(process.keyfumbling));
    return false;
  }
}

// use this if the same action causes multiple rolls to not trigger timeout before being done
function rollKeyFumbleN(user, n) {
  if (process.keyfumbling == undefined) {
    process.keyfumbling = {};
  }
  const now = Date.now();
  if (process.keyfumbling[user]?.timeoutEnd > now) {
    process.keyfumbling[user].timeoutEnd += MIN_FUMBLE_TIMEOUT + Math.floor(Math.random() * (MAX_FUMBLE_TIMEOUT - MIN_FUMBLE_TIMEOUT));
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`, JSON.stringify(process.keyfumbling));
    return Array(n).fill(true);
  } else {
    process.keyfumbling[user] = {
      timeoutEnd: now + MIN_FUMBLE_TIMEOUT + Math.floor(Math.random() * (MAX_FUMBLE_TIMEOUT - MIN_FUMBLE_TIMEOUT)),
    };
  }
  const fumbleChance = getFumbleChance(user);

  const results = [];
  for (let i = 0; i < n; i++) {
    if (Math.random() < fumbleChance) {
      if (optins.getBlessedLuck(user)) {
        if (process.keyfumbling[user]?.blessing) process.keyfumbling[user].blessing += 1 - fumbleChance;
        else process.keyfumbling[user].blessing = 1 - fumbleChance;
      }
      results[i] = true;
    } else {
      if (process.keyfumbling[user]?.blessing) process.keyfumbling[user].blessing = 0;
      results[i] = false;
    }
  }

  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/keyfumbling.txt`, JSON.stringify(process.keyfumbling));
  return results;
}

// return of 0 = never, 1+ = always
function getFumbleChance(user) {
  if (process.keyfumbling == undefined) {
    process.keyfumbling = {};
  }
  if (!optins.getKeyFumbling(user)) return 0;
  let chance = getArousal(user);
  const chastity = getChastity(user);
  if (chastity) {
    const hoursBelted = Date.now() - chastity.timestamp / (60 * 60 * 1000);
    chance += calcFrustration(hoursBelted);
  }

  // chance is increased if the user is wearing mittens
  if (getMitten(user)) {
    chance += 10;
    chance *= 1.1;
  }

  if (chance < 100 && optins.getBlessedLuck(user)) {
    chance -= process.keyfumbling[user]?.blessing ?? 0;
  }

  // divine intervention
  if (chance < 100 && Math.random() < 0.02) chance -= 50;

  return chance / 100;
}

async function handleKeyFinding(message) {
  const findSuccessChance = calcFindSuccessChance(message.author.id);

  const findableChastityKeys = getFindableChastityKeys(message.author.id);
  for ([lockedUser, chance] of findableChastityKeys) {
    if (Math.random() < chance) {
      if (Math.random() < findSuccessChance) {
        sendFindMessage(message, lockedUser, "chastity belt");
        findChastityKey(lockedUser, message.author.id);
      } else {
        sendFindFumbleMessage(message, lockedUser, "chastity belt");
      }
    }
  }

  const findableCollarKeys = getFindableCollarKeys(message.author.id);
  for ([lockedUser, chance] of findableCollarKeys) {
    if (Math.random() < chance) {
      if (Math.random() < findSuccessChance) {
        sendFindMessage(message, lockedUser, "collar");
        findCollarKey(lockedUser, message.author.id);
      } else {
        sendFindFumbleMessage(message, lockedUser, "collar");
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
  // currently just make it so mittens might make you fail
  if (getMitten(user)) return 0.5;
  else return 1;
}

exports.getFumbleChance = getFumbleChance;
exports.rollKeyFumble = rollKeyFumble;
exports.rollKeyFumbleN = rollKeyFumbleN;
exports.handleKeyFinding = handleKeyFinding;
