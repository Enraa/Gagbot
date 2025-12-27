const { findCollarKey } = require("./collarfunctions");
const { findChastityKey, getChastity, getArousal, calcFrustration } = require("./vibefunctions");
const { their } = require("./pronounfunctions");
const { getMitten } = require("./gagfunctions");
const { optins } = require("./optinfunctions");
const fs = require("fs");
const { getUserVar, setUserVar } = require("./usercontext");
const { getHeavy } = require("./heavyfunctions");

// return true if the user fumbles
function rollKeyFumble(keyholder, locked) {
  if (process.keyfumbling == undefined) {
    process.keyfumbling = {};
  }
  const fumbleChance = getFumbleChance(keyholder, locked);
  if (!fumbleChance) return false;
  if (Math.random() < fumbleChance) {
    if (optins.getBlessedLuck(keyholder)) {
      const blessing = getUserVar(keyholder, "blessed") ?? 0;
      setUserVar(keyholder, "blessing", blessing + 1 - fumbleChance);
    }
    return true;
  } else {
    setUserVar(keyholder, "blessing", 0);
    return false;
  }
}

// use this if the same action causes multiple rolls to not trigger timeout before being done
function rollKeyFumbleN(keyholder, locked, n) {
  const fumbleChance = getFumbleChance(keyholder, locked);
  if (!fumbleChance) return Array(n).fill(false);
  const results = [];
  for (let i = 0; i < n; i++) {
    if (Math.random() < fumbleChance) {
      if (optins.getBlessedLuck(keyholder)) {
        const blessing = getUserVar(keyholder, "blessed") ?? 0;
        setUserVar(keyholder, "blessing", blessing + 1 - fumbleChance);
      }
      results[i] = true;
    } else {
      setUserVar(keyholder, "blessing", 0);
      results[i] = false;
    }
  }

  return results;
}

// return of 0 = never, 1+ = always
function getFumbleChance(keyholder, locked) {
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

  if (chance < 100 && optins.getBlessedLuck(keyholder)) chance -= getUserVar(keyholder, "blessed") ?? 0;

  // divine intervention
  if (chance < 100 && Math.random() < 0.02) chance -= 50;

  return chance / 100;
}

async function handleKeyFinding(message) {
  if (process.discardedKeys == undefined) process.discardedKeys = [];
  if (Math.random() > (Math.min(message.content.length / 20, 20) * process.discardedKeys.length) / 100) return;
  const idx = Math.floor(Math.random() * process.discardedKeys.length);
  const restraint = process.discardedKeys[idx];

  if (Math.random() < calcFindSuccessChance(message.author.id)) {
    const findFunction = getFindFunction(restraint.restraint);
    if (findFunction(idx, message.author.id)) sendFindMessage(message, restraint.wearer, restraint.restraint);
  } else {
    sendFindFumbleMessage(message, restraint.wearer, restraint.restraint);
  }
}

function getFindFunction(restraint) {
  switch (restraint) {
    case "chastity belt":
      return findChastityKey;
    case "collar":
      return findCollarKey;
    default:
      console.log(`No find function for restraint ${restraint}`);
      return (_0, _1) => false;
  }
}

async function sendFindMessage(message, lockedUser, restraint) {
  try {
    if (message.author.id == lockedUser) message.channel.send(`${message.author} has found the key to ${their(message.author.id)} ${restraint}!`);
    else message.channel.send(`${message.author} has found the key to <@${lockedUser}>'s ${restraint}!`);
  }
  catch (err) {
    console.log(err); // Seriously plz dont crash
  }
}

async function sendFindFumbleMessage(message, lockedUser, restraint) {
  try {
    if (message.author.id == lockedUser) message.channel.send(`${message.author} has found the key to ${their(message.author.id)} ${restraint} but fumbles when trying to pick it up!`);
    else message.channel.send(`${message.author} has found the key to <@${lockedUser}>'s ${restraint} but fumbles when trying to pick it up!`);
  }
  catch (err) {
    console.log(err); // Seriously plz dont crash
  }
}

function calcFindSuccessChance(user) {
  if (getHeavy(user)) return 0;
  if (getMitten(user)) return 0.5;
  else return 1;
}

exports.getFumbleChance = getFumbleChance;
exports.rollKeyFumble = rollKeyFumble;
exports.rollKeyFumbleN = rollKeyFumbleN;
exports.handleKeyFinding = handleKeyFinding;
