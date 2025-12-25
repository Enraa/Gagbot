const fs = require("fs");

const MAX_BREATH_TABLE = [2000, 310, 250, 205, 165, 140, 120, 100, 80, 65, 50, 35, 20, 10, 10, 10];
const BREATH_RECOVERY_TABLE = [2000, 11.5, 9.5, 8, 6, 5, 4, 3, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1, 0.02];

const gaspSounds = ["*hff*", "*hnnf*", "*ahff*", "*hhh*", "*nnn*", "*hnn*"];
const silenceReplacers = [" ", ".", ",", ""];
const specialCharacterCosts = new Map(["!", 4], ["-", 0]);

const assignCorset = (user, tightness = 5) => {
  if (process.corset == undefined) process.corset = {};
  const currentBreath = process.corset[user] ? getBreath(user) : null;
  const maxBreath = calcMaxBreath(tightness);
  const breathRecovery = calcBreathRecovery(tightness);
  process.corset[user] = {
    tightness: tightness,
    maxBreath: maxBreath,
    breathRecovery: breathRecovery,
    breath: currentBreath ? (currentBreath > maxBreath ? maxBreath : currentBreath) : maxBreath,
    timestamp: Date.now(),
  };
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
};

const getCorset = (user) => {
  if (process.corset == undefined) process.corset = {};
  return process.corset[user];
};

const removeCorset = (user) => {
  if (process.corset == undefined) process.corset = {};
  delete process.corset[user];
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
};

// Consumes breath and returns possibly modified text
function corsetLimitWords(user, text) {
  // Bad bottom for shouting! Corsets should make you SILENT. Double all breath used.
  let globalMultiplier = text.match(/^\s*#+\s/) ? 2 : 1;
  const corset = calcBreath(user);
  // Tightlaced bottoms must only whisper
  if (corset.tightness >= 7 && !text.match(/^\s*\-#\s/)) globalMultiplier *= 2;
  // Bottoms cannot shout!
  text = text.replace(/^\s*#+\s/, "");
  text = text.replaceAll(/\n\s*#+\s/g, "\n");
  let silence = false;
  let wordsinmessage = text.split(" ");
  let newwordsinmessage = [];
  for (const i in wordsinmessage) {
    if (!corset.maxBreath) break;

    let word = wordsinmessage[i];
    if (word.length == 0) {
      if (!silence) newwordsinmessage.push(word);
    } else {
      for (const char of word) {
        // Capitals cost more breath
        if (char > 64 && char < 91) corset.breath -= globalMultiplier;
        const cost = specialCharacterCosts.get(char) ?? 1;
        corset.breath -= cost * globalMultiplier;
      }

      if (word.length < 3) corset.breath -= (3 - word.length) * globalMultiplier;

      if (corset.breath < -2 * corset.maxBreath && newwordsinmessage.length > 5 - Math.ceil(corset.tightness / 2)) silence = true;

      // add gasping sounds once at half of max breath
      if (
        !silence &&
        corset.breath < corset.maxBreath / 2 &&
        Math.random() < Math.min(corset.tightness / 10, 1 - (Math.max(corset.breath, -corset.maxBreath) + corset.maxBreath) / (corset.tightness * corset.maxBreath * 0.2))
      ) {
        newwordsinmessage.push(gaspSounds[Math.floor(Math.random() * gaspSounds.length)]);
      }

      // SILENCE BOTTOM
      if (!silence && corset.tightness >= 5) word = word.replaceAll("!", "~");

      // remove letters if out of breath
      if (!silence && corset.breath < 0) {
        const toRemove = (word.length * -corset.breath) / corset.maxBreath;
        const removeIdxs = [];
        for (let i = 0; i < toRemove; i++) {
          removeIdxs.push(Math.floor(Math.random() * word.length));
        }

        let newWord = "";
        for (const idx in word) {
          if (removeIdxs.includes(Number(idx))) newWord += silenceReplacers[Math.floor(Math.random() * silenceReplacers.length)];
          else newWord += word[idx];
        }
        word = newWord;
      }

      if (!silence) newwordsinmessage.push(word);
    }
  }
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
  if (newwordsinmessage.length == 0) return "";
  let outtext = newwordsinmessage.join(" ");
  // Replace other instances of small speak so we only have one.
  if (corset.tightness >= 7) {
    outtext = outtext.replace(/^\s*\-#\s/, "");
    outtext = outtext.replaceAll(/\n\s*\-#\s/g, "\n");
    outtext = outtext.replaceAll("\n", "\n-# ");
    outtext = `-# ${outtext}`;
  }
  return outtext;
}

function calcMaxBreath(tightness) {
  if ((tightness | 0) >= MAX_BREATH_TABLE.length) return 0;
  return MAX_BREATH_TABLE[tightness | 0];
}

function calcBreathRecovery(tightness) {
  if ((tightness | 0) >= BREATH_RECOVERY_TABLE.length) return 0;
  return BREATH_RECOVERY_TABLE[tightness | 0];
}

// calculates current breath and returns corset. Does not save to file.
function calcBreath(user) {
  if (process.corset == undefined) process.corset = {};
  const corset = process.corset[user];
  if (!corset) return null;
  const now = Date.now();
  const newBreath = corset.breath + corset.breathRecovery * ((now - corset.timestamp) / 1000);
  if (newBreath > corset.maxBreath) corset.breath = corset.maxBreath;
  else corset.breath = newBreath;
  corset.timestamp = now;
  return corset;
}

function getBreath(user) {
  const corset = calcBreath(user);
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
  return corset.breath;
}

// consumes specified breath and returns true if user had enough
function tryExpendBreath(user, exertion) {
  const corset = calcBreath(user);
  corset.breath -= exertion;
  fs.writeFileSync(`${process.GagbotSavedFileDirectory}/corsetusers.txt`, JSON.stringify(process.corset));
  return corset.breath > 0;
}

exports.assignCorset = assignCorset;
exports.getCorset = getCorset;
exports.removeCorset = removeCorset;
exports.corsetLimitWords = corsetLimitWords;

exports.getBreath = getBreath;
exports.tryExpendBreath = tryExpendBreath;
