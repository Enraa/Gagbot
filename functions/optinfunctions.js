const fs = require("fs");

const optins = new Map([
  [
    "SlimeSpreading",
    [0, "Slime Spreading", "Allows slimy restraints to spread to you"],
  ],
  [
    "KeyGiving",
    [
      1,
      "Key Giving",
      "Allows keyholders to give keys for your restraints to other keyholders",
    ],
  ],
  [
    "CursedRestraints",
    [
      2,
      "Cursed Restraints",
      "Allows restraints equipped on you to be cursed variants",
    ],
  ],
  [
    "KeyDiscarding",
    [
      3,
      "Key Discarding",
      "Allows keys for your restraints to be discarded or lost",
    ],
  ],
  [
    "AnyFinders",
    [
      4,
      "Any Finders",
      "Allows discarded or lost keys for your restraints to be found by anyone",
    ],
  ],
]);

function setOptin(user, offset) {
  if (process.optins == undefined) process.optins = {};
  let bitfield = process.optins[user] ?? 0;
  bitfield |= 1 << offset;
  process.optins[user] = bitfield;
  fs.writeFileSync(
    `${process.GagbotSavedFileDirectory}/optinusers.txt`,
    JSON.stringify(process.optins)
  );
}

function unsetOptin(user, offset) {
  if (process.optins == undefined) process.optins = {};
  let bitfield = process.optins[user] ?? 0;
  bitfield &= ~(1 << offset);
  process.optins[user] = bitfield;
  fs.writeFileSync(
    `${process.GagbotSavedFileDirectory}/optinusers.txt`,
    JSON.stringify(process.optins)
  );
}

function getOptin(user, offset) {
  if (process.optins == undefined) process.optins = {};
  let bitfield = process.optins[user] ?? 0;
  return (bitfield & (1 << offset)) > 0;
}

const functions = {};

optins.forEach(([offset], optin) => {
  functions[`set${optin}`] = (user) => setOptin(user, offset);
  functions[`unset${optin}`] = (user) => unsetOptin(user, offset);
  functions[`get${optin}`] = (user) => getOptin(user, offset);
});

exports.optinMap = optins;
exports.setOptin = setOptin;
exports.unsetOptin = unsetOptin;
exports.getOptin = getOptin;
exports.optins = functions;
