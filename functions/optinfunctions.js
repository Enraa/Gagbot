const fs = require("fs");

const optins = new Map([
  ["KeyGiving", [0, "Key Giving", "Allows keyholders to give keys for your restraints to other keyholders"]],
  ["KeyFumbling", [-1, "Key Fumbling", "Makes it hard to handle keys when aroused or frustrated"]],
  ["OthersKeyFumbling", [2, "Others Key Fumbling", "Allows others to fumble with your keys"]],
  ["BlessedLuck", [3, "Blessed Luck", "Makes it so failed rolls make future rolls more lucky"]],
  ["KeyDiscarding", [4, "Key Discarding", "Allows keys for your restraints to be discarded or lost"]],
  ["AnyFinders", [5, "Any Finders", "Allows discarded or lost keys for your restraints to be found by anyone"]],
]);

function setOptin(user, offset) {
  if (process.optins == undefined) process.optins = {};
  let bitfield = process.optins[user] ?? 0;
  bitfield |= 1 << offset;
  process.optins[user] = bitfield;
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/optinusers.txt`, JSON.stringify(process.optins));
}

function unsetOptin(user, offset) {
  if (process.optins == undefined) process.optins = {};
  let bitfield = process.optins[user] ?? 0;
  bitfield &= ~(1 << offset);
  process.optins[user] = bitfield;
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/optinusers.txt`, JSON.stringify(process.optins));
}

function getOptin(user, offset) {
  if (process.optins == undefined) process.optins = {};
  let bitfield = process.optins[user] ?? 0;
  return (bitfield & (1 << offset)) > 0;
}

function optinIsLocked(user, offset) {
  if (process.chastity == undefined) process.chastity = {};
  if (offset == 1 && process.chastity[user]) return "Key Fumbling cannot be changed while locked in chastity. No cheating~";
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
