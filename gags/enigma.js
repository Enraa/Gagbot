const lockedCharacters = "\\'\",.?~!()[]{}<>*";

function garbleText(text, intensity) {
  return text
    .split(" ")
    .map((word) => {
      const letters = word.split("");
      const idxMap = letters
        .map((letter, idx) => [letter, idx])
        .filter(([letter, _]) => !lockedCharacters.includes(letter))
        .map(([_, idx]) => idx);
      for (let i = 0; i < intensity; i++) {
        const a = idxMap[Math.floor(Math.random() * idxMap.length)];
        const b = idxMap[Math.floor(Math.random() * idxMap.length)];
        if (a != b) {
          const aCap = letters[a].toUpperCase() == letters[a];
          const bCap = letters[b].toUpperCase() == letters[b];
          const tmp = letters[a];
          letters[a] = aCap ? letters[b].toUpperCase() : letters[b].toLowerCase();
          letters[b] = bCap ? tmp.toUpperCase() : tmp.toLowerCase();
        }
      }
      return letters.join("");
    })
    .join(" ");
}

exports.garbleText = garbleText;
exports.choicename = "Enigma Gag";
