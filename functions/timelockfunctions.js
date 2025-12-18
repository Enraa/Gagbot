const { removeChastity } = require("./vibefunctions");
const fs = require("fs");

// returns whether the locking was successful
function timelockChastity(client, wearer, unlockTime, access, keyholderAfter) {
  const now = Date.now();
  if (now >= unlockTime) return false;
  if (process.chastity == undefined) process.chastity = {};
  const chastity = process.chastity[wearer];
  if (!chastity) return false;
  if (chastity.keyholder == wearer) {
    chastity.keyholder = null;
    chastity.keyholderAfter = keyholderAfter ? wearer : null;
  } else chastity.keyholderAfter = [null, wearer, chastity.keyholder][keyholderAfter];
  if (access == 2) chastity.keyholder = null;
  chastity.unlockTime = unlockTime;
  chastity.access = access;
  setTimeout(() => {
    unlockTimelockChastity(client, wearer);
  }, unlockTime - now);
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
  return true;
}

// returns whether the unlocking was successful
function unlockTimelockChastity(client, wearer, skipWrite = false) {
  if (process.chastity == undefined) process.chastity = {};
  const chastity = process.chastity[wearer];
  if (!chastity || !chastity.unlockTime) return false;
  chastity.keyholder = chastity.keyholderAfter;
  chastity.keyholderAfter = null;
  chastity.unlockTime = null;
  chastity.access = null;
  if (!chastity.keyholder) removeChastity(wearer);
  else if (!skipWrite) fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
  sendTimelockChastityUnlockMessage(client, wearer, chastity.keyholder);
  return true;
}

function restartChastityTimers(client) {
  if (process.chastity == undefined) process.chastity = {};
  const now = Date.now();
  const toUnlock = [];
  for (const wearer in process.chastity) {
    const unlockTime = process.chastity[wearer]?.unlockTime;
    if (unlockTime >= now) toUnlock.push(wearer);
    else
      setTimeout(() => {
        unlockTimelockChastity(client, wearer);
      }, unlockTime - now);
  }
  for (const wearer of toUnlock) {
    unlockTimelockChastity(client, wearer, true);
  }
  // only write to file once for this
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/chastityusers.txt`, JSON.stringify(process.chastity));
}

async function sendTimelockChastityUnlockMessage(client, wearer, keyholder) {
  const channel = await client.channels.fetch(process.env.CHANNELID);
  if (!keyholder) channel.send(`As the timer finally expires, <@${wearer}>'s chastity belt unlocks and falls to the floor`);
  else channel.send(`As the timer finally expires, <@${wearer}>'s chastity belt returns to normal with <@${keyholder}> holding the keys`);
}

exports.timelockChastity = timelockChastity;
exports.unlockTimelockChastity = unlockTimelockChastity;
exports.restartChastityTimers = restartChastityTimers;
