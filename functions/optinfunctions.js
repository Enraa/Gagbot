const fs = require("fs");

const optins = new Map([
  ["KeyGiving", [0, "Key Giving", "Allows keyholders to give keys for your restraints to other keyholders"]],
  ["EnableVibes", [-1, "Enable Vibes", "Allow people to equip vibes on you"]],
  ["DynamicArousal", [-2, "Dynamic Arousal", "Use a system where arousal changes over time"]],
  ["KeyFumbling", [-3, "Key Fumbling", "Makes it hard to handle keys when aroused or frustrated"]],
  ["OthersKeyFumbling", [4, "Others Key Fumbling", "Allows others to fumble with your keys"]],
  ["FumbleOthersKeys", [5, "Fumble Others Keys", "Allows you to fumble with others keys"]],
  ["BlessedLuck", [6, "Blessed Luck", "Makes it so failed rolls make future rolls more lucky"]],
  ["KeyDiscarding", [7, "Key Discarding", "Allows keys for your restraints to be discarded or lost"]],
]);

function setOptin(user, offset) {
  if (process.optins == undefined) process.optins = {};
  let bitfield = process.optins[user] ?? 0;
  bitfield |= 1 << offset;
  process.optins[user] = bitfield;
  onOptinChange(user, offset, 1);
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/optinusers.txt`, JSON.stringify(process.optins));
}

function unsetOptin(user, offset) {
  if (process.optins == undefined) process.optins = {};
  let bitfield = process.optins[user] ?? 0;
  bitfield &= ~(1 << offset);
  process.optins[user] = bitfield;
  onOptinChange(user, offset, 0);
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/optinusers.txt`, JSON.stringify(process.optins));
}

function getOptin(user, offset) {
  if (process.optins == undefined) process.optins = {};
  let bitfield = process.optins[user] ?? 0;
  return (bitfield & (1 << offset)) > 0;
}

function onOptinChange(user, offset, newValue) {
  if (offset == 1 && newValue == 1) {
    setOptin(user, 2);
    if (process.vibe && process.vibe[user]) delete process.vibe[user];
    if (process.arousal && process.arousal[user]) delete process.arousal[user];
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/arousal.txt`, JSON.stringify(process.arousal));
  }
}

function optinIsLocked(user, offset) {
  if (process.chastity == undefined) process.chastity = {};
  if (offset == 2 && getOptin(user, 1)) return "Cannot have Dynamic Arousal without vibes";
  if (offset == 3 && process.chastity[user]) return "Key Fumbling cannot be changed while locked in chastity. No cheating~";
  return null;
}

const functions = {};

optins.forEach(([rawOffset], optin) => {
  const inverted = rawOffset < 0;
  const offset = Math.abs(rawOffset);

  functions[`set${optin}`] = (user) => setOptin(user, offset);
  functions[`unset${optin}`] = (user) => unsetOptin(user, offset);
  functions[`get${optin}`] = (user) => (getOptin(user, offset) ? !inverted : inverted);
});

exports.optinMap = optins;
exports.setOptin = setOptin;
exports.unsetOptin = unsetOptin;
exports.getOptin = getOptin;
exports.optinIsLocked = optinIsLocked;
exports.optins = functions;
