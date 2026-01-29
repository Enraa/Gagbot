const fs = require("fs");
const path = require("path");
const nlp = require("compromise");
const nlpSpeech = require("compromise-speech");
nlp.extend(nlpSpeech);

const MAX_BREATH_TABLE = [2000, 56, 48, 40, 34, 28, 24, 20, 16, 13, 10, 7, 4, 3, 2, 2];
const MIN_BREATH_TABLE = [0, -120, -116, -112, -108, -104, -96, -88, -80, -72, -60, -60, -48, -40, -30, -20];
const BREATH_RECOVERY_TABLE = [2000, 4.6, 3.8, 3.2, 2.6, 2, 1.6, 1.28, 1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.04, 0.008];

// NOTE: Encapsulate gaspSounds in EOT characters so the Doll Visor doesn't split on them.
const gaspSounds = ["*hff*", "*hnnf*", "*ahff*", "*hhh*", "*nnh*", "*hnn*", "*hng*", "*uah*", "*uhf*"];
const silenceReplacers = [" ", ".", ",", ""];
const silenceMessages = ["-# *Panting heavily*", "-# *Completely out of breath*", "-# *Desperately gasping for air*", "-# *About to pass out*"];

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
function corsetLimitWords(text, parent, user, msgModified) {
	// just do nothing if no text
	if (text.length == 0 || text.match(/^\s*$/)) return text;

	// Is this line subscripted or superscripted?
	// X = -1    - Subscripted
	// X = [1-3] - Superscripted, with X #'s. 1 is loudest.
	let scriptLevel = parent.parent.subscript;

	// Bad bottom for shouting! Corsets should make you SILENT. Double all breath used.
	let globalMultiplier = scriptLevel > 0 ? 2 : 1;
	const corset = calcBreath(user);

	// Tightlaced bottoms must only whisper
	if (corset.tightness >= 7 && scriptLevel >= 0) globalMultiplier *= 2;

	const idxMap = [];
	let escaped = false;
	text
		.trimEnd()
		.split("")
		.forEach((char, idx) => {
			if (char == "") {
				escaped = !escaped;
				return;
			}
			if (escaped) return;
			if (char.match(/[a-zA-Z]/)) idxMap.push(idx);
			else if (idxMap.length > 0 && char.match(/\s/)) idxMap.push(idx);
		});

	let silence = false;
	const parsed = nlp(idxMap.map((idx) => text[idx]).join(""))
		.compute("syllables")
		.terms()
		.json();

	const chars = text.split("");

	let currIdx = 0;
	let silenceIdx;

	for (const i in parsed) {
		let word = parsed[i].text;
		if (word.length > 0) {
			let capitals = 0;
			for (const char of word) if (/[A-Z]/.test(char)) capitals++;

			const syllables = parsed[i].terms[0].syllables;

			for (const j in syllables) {
				let syllable = syllables[j];
				corset.breath -= globalMultiplier;

				// Capitals cost more breath
				corset.breath -= (globalMultiplier * capitals) / 2;

				// Shouting is not fitting for a bottom
				if (corset.tightness >= 9 && capitals > 0) syllable = syllable.toLowerCase();
				else if (corset.tightness >= 7 && capitals > 1) syllable = syllable.toLowerCase();
				else if (corset.tightness >= 5 && capitals > 2) syllable = syllable.toLowerCase();
				else if (corset.tightness >= 4 && capitals > 3) syllable = syllable.toLowerCase();
				else if (corset.tightness >= 3 && capitals > 4) syllable = syllable.toLowerCase();

				let ended = false;
				if (corset.breath < -MAX_BREATH_TABLE[corset.tightness] && i > 5 - Math.ceil(corset.tightness / 2)) {
					if (!silence) {
						ended = true;
						silenceIdx = currIdx;
					}
					silence = true;
				}

				// add gasping sounds once at half of max breath
				let gasp = "";
				if (!silence && corset.breath < MAX_BREATH_TABLE[corset.tightness] / 2 && Math.random() < Math.min(corset.tightness / 10, 1 - (Math.max(corset.breath, -MAX_BREATH_TABLE[corset.tightness]) + MAX_BREATH_TABLE[corset.tightness]) / (corset.tightness * MAX_BREATH_TABLE[corset.tightness] * 0.2))) {
					if (j == 0) gasp = " " + gaspSounds[Math.floor(Math.random() * gaspSounds.length)] + " ";
					else gasp = "-" + gaspSounds[Math.floor(Math.random() * gaspSounds.length)] + "-";
				}

				for (const k in syllable) {
					if (ended && k == 0) chars[idxMap[currIdx++]] = "-";
					else if (silence) chars[idxMap[currIdx++]] = "";
					else if (k == 0) chars[idxMap[currIdx++]] = gasp + syllable[k];
					else chars[idxMap[currIdx++]] = syllable[k];
				}
			}
			currIdx++;
		}
	}

	let outtext = (silence ? chars.slice(0, silenceIdx + 1) : chars).join("");

	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.corset = true;
	if (outtext.length == 0) {
		msgModified.modified = true;
		return "";
	}

	if (text != outtext) {
		msgModified.modified = true;
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
