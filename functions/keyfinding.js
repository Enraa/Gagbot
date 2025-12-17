const { getFindableCollarKeys, findCollarKey } = require("./collarfunctions");
const { getFindableChastityKeys, findChastityKey } = require("./vibefunctions");
const { their } = require("./pronounfunctions");

async function handleKeyFinding(message) {
  const findableChastityKeys = getFindableChastityKeys(message.author.id);
  for ([lockedUser, chance] of findableChastityKeys) {
    if (Math.random() < chance) {
      sendFindMessage(message, lockedUser, "chastity belt");
      findChastityKey(lockedUser, message.author.id);
    }
  }

  const findableCollarKeys = getFindableCollarKeys(message.author.id);
  for ([lockedUser, chance] of findableCollarKeys) {
    if (Math.random() < chance) {
      sendFindMessage(message, lockedUser, "collar");
      findCollarKey(lockedUser, message.author.id);
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

exports.handleKeyFinding = handleKeyFinding;
