const fs = require("fs");
const path = require("path");

const MAX_BREATH_TABLE = [2000, 140, 120, 100, 85, 70, 60, 50, 40, 32.5, 25, 17.5, 10, 7.5, 5, 5];
const MIN_BREATH_TABLE = [0, -300, -290, -280, -270, -260, -240, -220, -200, -180, -150, -150, -120, -100, -75, -50];
const BREATH_RECOVERY_TABLE = [2000, 11.5, 9.5, 8, 6.5, 5, 4, 3.2, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1, 0.02];

// NOTE: Encapsulate gaspSounds in EOT characters so the Doll Visor doesn't split on them.
const gaspSounds = ["*hff*", "*hnnf*", "*ahff*", "*hhh*", "*nnh*", "*hnn*", "*hng*", "*uah*", "*uhf*"];
const silenceReplacers = [" ", ".", ",", ""];
const silenceMessages = ["-# *Panting heavily*", "-# *Completely out of breath*", "-# *Desperately gasping for air*", "-# *About to pass out*"];
const specialCharacterCosts = new Map([
	["!", 4],
	["-", 0],
	[".", 0],
	[",", 0],
	["?", 0],
	["(", 0],
	[")", 0],
	["[", 0],
	["]", 0],
	["{", 0],
	["}", 0],
	["*", 0],
	["\\", 0],
	["~", 0],
	["<", 0],
	[">", 0],
	["'", 0],
	['"', 0],
]);

const assignCorset = (user, tightness = 5, origbinder) => {
	if (process.corset == undefined) process.corset = {};
	const currentBreath = process.corset[user] ? getBreath(user) : null;
	let originalbinder = process.corset[user]?.origbinder;
	process.corset[user] = {
		tightness: tightness,
		breath: currentBreath ? Math.min(currentBreath, MAX_BREATH_TABLE[tightness]) : MAX_BREATH_TABLE[tightness],
		timestamp: Date.now(),
		origbinder: originalbinder ?? origbinder, // Preserve original binder until it is removed.
	};
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.corset = true;
};

const getCorset = (user) => {
	if (process.corset == undefined) process.corset = {};
	return process.corset[user];
};

const getCorsetBinder = (user) => {
	if (process.corset == undefined) process.corset = {};
	return process.corset[user]?.origbinder;
};

const removeCorset = (user) => {
	if (process.corset == undefined) process.corset = {};
	delete process.corset[user];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.corset = true;
};

// Consumes breath and returns possibly modified text
function corsetLimitWords(user, text) {
	// just do nothing if no text
	if (text.length == 0 || text.match(/^\s*$/)) return text;

	// Bad bottom for shouting! Corsets should make you SILENT. Double all breath used.
	let globalMultiplier = text.match(/^\s*#+\s/) ? 2 : 1;
	const corset = calcBreath(user);
	// Tightlaced bottoms must only whisper
	if (corset.tightness >= 7 && !text.match(/^\s*\-#\s/)) globalMultiplier *= 2;
	// Bottoms cannot shout!
	text = text.replace(/^\s*#+\s/, "");
	text = text.replaceAll(/\n\s*#+\s/g, "\n");
	if (corset.tightness >= 7) {
		text = text.replace(/^\s*\-#\s/, "");
		text = text.replaceAll(/\n\s*\-#\s/g, "\n");
	}
	let silence = false;
	let wordsinmessage = text.split(" ");
	let newwordsinmessage = [];
	for (const i in wordsinmessage) {
		let word = wordsinmessage[i];
		if (word.length == 0) {
			if (!silence) newwordsinmessage.push(word);
		} else {
			let capitals = 0;
			for (const char of word) {
				if (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) capitals++;
				const cost = specialCharacterCosts.get(char) ?? 1;
				corset.breath -= cost * globalMultiplier;
			}

			// Capitals cost more breath
			corset.breath -= globalMultiplier * capitals;

			// Shouting is not fitting for a bottom
			if (corset.tightness >= 9 && capitals > 0) word = word.toLowerCase();
			else if (corset.tightness >= 7 && capitals > 1) word = word.toLowerCase();
			else if (corset.tightness >= 5 && capitals > 2) word = word.toLowerCase();
			else if (corset.tightness >= 4 && capitals > 3) word = word.toLowerCase();
			else if (corset.tightness >= 3 && capitals > 4) word = word.toLowerCase();

			if (word.length < 3) corset.breath -= (3 - word.length) * globalMultiplier;

			if (corset.breath < -MAX_BREATH_TABLE[corset.tightness] && newwordsinmessage.length > 5 - Math.ceil(corset.tightness / 2)) silence = true;

			// add gasping sounds once at half of max breath
			if (!silence && corset.breath < MAX_BREATH_TABLE[corset.tightness] / 2 && Math.random() < Math.min(corset.tightness / 10, 1 - (Math.max(corset.breath, -MAX_BREATH_TABLE[corset.tightness]) + MAX_BREATH_TABLE[corset.tightness]) / (corset.tightness * MAX_BREATH_TABLE[corset.tightness] * 0.2))) {
				newwordsinmessage.push(gaspSounds[Math.floor(Math.random() * gaspSounds.length)]);
			}

			// SILENCE BOTTOM
			if (!silence && corset.tightness >= 5) word = word.replaceAll("!", "\\~");

			if (!silence) newwordsinmessage.push(word);
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.corset = true;
	if (newwordsinmessage.length == 0) return "";
	let outtext = newwordsinmessage.join(" ");
	// Replace other instances of small speak so we only have one.
	if (corset.tightness >= 7) {
		outtext = outtext.replaceAll(/\n\s*/g, "\n-# ");
		if (outtext.length > 0) outtext = `-# ${outtext}`;
	}
	return outtext;
}

// calculates current breath and returns corset. Does not save to file.
function calcBreath(user) {
	if (process.corset == undefined) process.corset = {};
	const corset = process.corset[user];
	if (!corset) return null;
	if (corset.breath < MIN_BREATH_TABLE[corset.tightness]) corset.breath = MIN_BREATH_TABLE[corset.tightness];
	const now = Date.now();
	let recoveryCoefficient = 1;
	if (process.gags == undefined) process.gags = {};
	if (process.gags[user] && process.gags[user].length > 0) {
		const gagsPaths = path.join(__dirname, "..", "gags");
		const gagFiles = fs.readdirSync(gagsPaths).filter((file) => file.endsWith(".js"));
		process.gags[user].forEach((gag) => {
			if (gagFiles.includes(`${gag.gagtype}.js`)) {
				let gagData = require(path.join(gagsPaths, `${gag.gagtype}.js`));
				let intensity = gag.intensity ? gag.intensity : 5;
				if (gagData.breathRecovery) recoveryCoefficient *= gagData.breathRecovery(user, intensity);
			}
		});
	}
	const newBreath = corset.breath + BREATH_RECOVERY_TABLE[corset.tightness] * ((now - corset.timestamp) / 1000) * recoveryCoefficient;
	if (newBreath > MAX_BREATH_TABLE[corset.tightness]) corset.breath = MAX_BREATH_TABLE[corset.tightness];
	else corset.breath = newBreath;
	corset.timestamp = now;
	return corset;
}

function getBreath(user) {
	const corset = calcBreath(user);
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.corset = true;
	return corset.breath;
}

// consumes specified breath and returns true if user had enough
function tryExpendBreath(user, exertion) {
	const corset = calcBreath(user);
	corset.breath -= exertion;
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.corset = true;
	return corset.breath > 0;
}

function silenceMessage() {
	return silenceMessages[Math.floor(Math.random() * silenceMessages.length)];
}

exports.assignCorset = assignCorset;
exports.getCorset = getCorset;
exports.getCorsetBinder = getCorsetBinder;
exports.removeCorset = removeCorset;
exports.corsetLimitWords = corsetLimitWords;
exports.silenceMessage = silenceMessage;

exports.getBreath = getBreath;
exports.tryExpendBreath = tryExpendBreath;
