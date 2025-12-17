const { getFindableCollarKeys, findCollarKey } = require("./collarfunctions");
const {
  getFindableChastityKeys,
  findChastityKey,
  getChastity,
  getArousal,
  calcFrustration,
} = require("./vibefunctions");
const { their } = require("./pronounfunctions");
const { getMitten } = require("./gagfunctions");

// return of 0 = never, 1+ = always
function getFumbleChance(user) {
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
  if (message.author.id == lockedUser) {
    message.channel.send(
      `${message.author} has found the key to ${their(
        message.author.id
      )} ${restraint}!`
    );
  } else {
    message.channel.send(
      `${message.author} has found the key to <@${lockedUser}>'s ${restraint}!`
    );
  }
}

async function sendFindFumbleMessage(message, lockedUser, restraint) {
  if (message.author.id == lockedUser) {
    message.channel.send(
      `${message.author} has found the key to ${their(
        message.author.id
      )} ${restraint} but fumbles when trying to pick it up!`
    );
  } else {
    message.channel.send(
      `${message.author} has found the key to <@${lockedUser}>'s ${restraint} but fumbles when trying to pick it up!`
    );
  }
}

function calcFindSuccessChance(user) {
  // currently just make it so mittens might make you fail
  if (getMitten(user)) return 0.5;
  else return 1;
}

exports.getFumbleChance = getFumbleChance;
exports.handleKeyFinding = handleKeyFinding;
