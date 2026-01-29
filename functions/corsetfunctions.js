const fs = require("fs");
const path = require("path");
const nlp = require("compromise");
const nlpSpeech = require("compromise-speech");
nlp.extend(nlpSpeech);

const TRAITS = ["name", "maxBreath", "minBreath", "breathRecovery", "gaspCoefficient", "gaspLimit", "silenceLimit", "minWords", "afterUsingBreath"];

const DEFAULT_CORSET = {
	name: "Leather Corset",
	type: "corset_leather",
	maxBreath: [2000, 56, 48, 40, 34, 28, 24, 20, 16, 13, 10, 7, 4, 3, 2, 2],
	minBreath: [0, -120, -116, -112, -108, -104, -96, -88, -80, -72, -60, -60, -48, -40, -30, -20],
	breathRecovery: [2000, 4.6, 3.8, 3.2, 2.6, 2, 1.6, 1.28, 1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.04, 0.008],
	gaspCoefficient: 1,
	gaspLimit: [1000, 28, 24, 20, 17, 14, 12, 10, 8, 6.5, 5, 3.5, 2, 1.5, 1, 1],
	silenceLimit: [-2000, -56, -48, -40, -34, -28, -24, -20, -16, -13, -10, -7, -4, -3, -2, -2],
	minWords: [10, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0],
	afterUsingBreath: (user, corset) => {},
};

const corsets = [
	DEFAULT_CORSET,
	// is a bit more forgiving on the max breath than the regular corset, but recovery is slower
	{
		name: "Latex Corset",
		type: "corset_latex",
		maxBreath: [2000, 70, 60, 52, 44, 36, 30, 25, 20, 16, 12, 8, 5, 4, 3, 2],
		minBreath: [0, -120, -116, -112, -108, -104, -96, -88, -80, -72, -60, -60, -48, -40, -30, -20],
		breathRecovery: [2000, 4.4, 3.6, 3, 2.4, 1.8, 1.5, 1.2, 0.9, 0.7, 0.5, 0.3, 0.15, 0.08, 0.03, 0.005],
		gaspCoefficient: 1,
		gaspLimit: [1000, 28, 24, 20, 17, 14, 12, 10, 8, 6.5, 5, 3.5, 2, 1.5, 1, 1],
		silenceLimit: [-2000, -56, -48, -40, -34, -28, -24, -20, -16, -13, -10, -7, -4, -3, -2, -2],
		minWords: [10, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0],
		afterUsingBreath: (user, corset) => {},
	},
	// is much more forgiving in general
	{
		name: "Cloth Corset",
		type: "corset_cloth",
		maxBreath: [2000, 112, 96, 80, 68, 56, 48, 40, 32, 26, 20, 14, 8, 6, 4, 4],
		minBreath: [-2000, -11, -96, -80, -68, -56, -48, -40, -32, -26, -20, -14, -8, -6, -4, -4],
		breathRecovery: [2000, 9.2, 7.6, 6.4, 5.2, 4, 3.2, 2.56, 2, 1.6, 1.2, 0.8, 0.4, 0.2, 0.08, 0.016],
		gaspCoefficient: 0.8,
		gaspLimit: [1000, 28, 24, 20, 17, 14, 12, 10, 8, 6.5, 5, 3.5, 2, 1.5, 1, 1],
		silenceLimit: [-2000, -56, -48, -40, -34, -28, -24, -20, -16, -13, -10, -7, -4, -3, -2, -2],
		minWords: [10, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0],
		afterUsingBreath: (user, corset) => {},
	},
	// is very punishing
	{
		name: "Masterwork Corset",
		type: "corset_masterwork",
		maxBreath: [2000, 40, 34, 28, 22.5, 18, 14.5, 12, 10, 8, 6, 4, 2.5, 2, 1.5, 1],
		minBreath: Array(16).fill(-2000),
		breathRecovery: [2000, 3.5, 2.9, 2.4, 2, 1.6, 1.25, 0.9, 0.6, 0.4, 0.25, 0.15, 0.08, 0.04, 0.016, 0.004],
		gaspCoefficient: 2,
		gaspLimit: [1500, 30, 25.5, 21, 16.875, 13.5, 10.875, 9, 7.5, 6, 4.5, 3, 1.875, 1.5, 1.125, 0.75],
		silenceLimit: [-2000, -40, -34, -28, -22.5, -18, -14.5, -12, -10, -8, -6, -4, -2.5, -2, -1.5, -1],
		minWords: Array(16).fill(0),
		afterUsingBreath: (user, corset) => {},
	},
	// tightens after overexertion
	{
		name: "Punishment Corset",
		type: "corset_punishment",
		maxBreath: [2000, 56, 48, 40, 34, 28, 24, 20, 16, 13, 10, 7, 4, 3, 2, 2],
		minBreath: [0, -120, -116, -112, -108, -104, -96, -88, -80, -72, -60, -60, -48, -40, -30, -20],
		breathRecovery: [2000, 4.6, 3.8, 3.2, 2.6, 2, 1.6, 1.28, 1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.04, 0.008],
		gaspCoefficient: 1.2,
		gaspLimit: [1000, 28, 24, 20, 17, 14, 12, 10, 8, 6.5, 5, 3.5, 2, 1.5, 1, 1],
		silenceLimit: [-2000, -56, -48, -40, -34, -28, -24, -20, -16, -13, -10, -7, -4, -3, -2, -2],
		minWords: [10, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0],
		afterUsingBreath: (user, corset) => {
			if (corset.tightness < 11 && corset.breath < corset.minBreath[corset.tightness]) {
				corset.tightness++;
			}
		},
	},
	// has high max breath but very low recovery
	{
		name: "Timekeeper's Corset",
		type: "corset_timekeeper",
		maxBreath: [2000, 168, 144, 120, 102, 88, 72, 60, 48, 39, 30, 21, 12, 9, 6, 5],
		minBreath: [0, -120, -116, -112, -108, -104, -96, -88, -80, -72, -60, -60, -48, -40, -30, -20],
		breathRecovery: [500, 1.15, 0.95, 0.8, 0.65, 0.5, 0.4, 0.32, 0.25, 0.2, 0, 0, 0, 0, 0, 0],
		gaspCoefficient: 1.2,
		gaspLimit: [1333, 112, 96, 80, 68, 59, 48, 40, 32, 26, 20, 14, 8, 6, 4, 3],
		silenceLimit: [-2000, -56, -48, -40, -34, -28, -24, -20, -16, -13, -10, -7, -4, -3, -2, -2],
		minWords: [10, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		afterUsingBreath: (user, corset) => {},
	},
];

const lookup = new Map(corsets.map((corset) => [corset.type, corset]));

// NOTE: Encapsulate gaspSounds in EOT characters so the Doll Visor doesn't split on them.
const gaspSounds = ["*hff*", "*hnnf*", "*ahff*", "*hhh*", "*nnh*", "*hnn*", "*hng*", "*uah*", "*uhf*"];
const silenceReplacers = [" ", ".", ",", ""];
const silenceMessages = ["-# *Panting heavily*", "-# *Completely out of breath*", "-# *Desperately gasping for air*", "-# *About to pass out*"];

const assignCorset = (user, type, tightness, origbinder) => {
	if (process.corset == undefined) process.corset = {};
	const old = process.corset[user];
	const currentBreath = old ? getBreath(user) : null;
	let originalbinder = old?.origbinder;
	type ??= old?.type ?? DEFAULT_CORSET.type;
	const newMaxBreath = lookup.get(type)?.maxBreath ?? DEFAULT_CORSET.maxBreath;
	process.corset[user] = {
		tightness: tightness ?? old?.tightness ?? 5,
		breath: currentBreath ? Math.min(currentBreath, newMaxBreath[tightness]) : newMaxBreath[tightness],
		timestamp: Date.now(),
		origbinder: originalbinder ?? origbinder, // Preserve original binder until it is removed.
		type: type,
	};
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.corset = true;
};

const getCorset = (user) => {
	if (process.corset == undefined) process.corset = {};
	const corset = process.corset[user];
	if (!corset) return corset;
	const traits = lookup.get(corset?.type ?? DEFAULT_CORSET.type) ?? DEFAULT_CORSET;
	for (const trait of TRAITS) corset[trait] = traits[trait];
	return corset;
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
	let lastSpace = false;
	text
		.trimEnd()
		.split("")
		.forEach((char, idx) => {
			if (char == "") {
				escaped = !escaped;
				return;
			}
			if (escaped) return;
			if (char.match(/[a-zA-Z\d]/)) {
				idxMap.push(idx);
				lastSpace = false;
			} else if (!lastSpace && idxMap.length > 0 && char.match(/\s/)) {
				idxMap.push(idx);
				lastSpace = true;
			}
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
				if (corset.breath < corset.silenceLimit[corset.tightness] && i >= corset.minWords[corset.tightness]) {
					if (!silence) {
						ended = true;
						silenceIdx = currIdx;
					}
					silence = true;
				}

				// add gasping sounds once at half of max breath
				let gasp = "";
				if (!silence && corset.breath < corset.gaspLimit[corset.tightness] && Math.random() < corset.gaspCoefficient * Math.min(corset.tightness / 10, 1 - (corset.breath - corset.silenceLimit[corset.tightness]) / (corset.gaspLimit[corset.tightness] - corset.silenceLimit[corset.tightness]))) {
					if (j == 0) gasp = gaspSounds[Math.floor(Math.random() * gaspSounds.length)] + " ";
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

	corset.afterUsingBreath(user, corset);

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
	const corset = getCorset(user);
	if (!corset) return null;
	if (corset.breath < corset.minBreath[corset.tightness]) corset.breath = corset.minBreath[corset.tightness];
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
	const newBreath = corset.breath + corset.breathRecovery[corset.tightness] * ((now - corset.timestamp) / 1000) * recoveryCoefficient;
	if (newBreath > corset.maxBreath[corset.tightness]) corset.breath = corset.maxBreath[corset.tightness];
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
	corset.afterUsingBreath(user, corset);
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.corset = true;
	return corset.breath > 0;
}

function silenceMessage() {
	return silenceMessages[Math.floor(Math.random() * silenceMessages.length)];
}

exports.corsetChoices = corsets.map(({ type, name }) => ({ name: name, value: type }));
exports.corsets = lookup;

exports.assignCorset = assignCorset;
exports.getCorset = getCorset;
exports.getCorsetBinder = getCorsetBinder;
exports.removeCorset = removeCorset;
exports.corsetLimitWords = corsetLimitWords;
exports.silenceMessage = silenceMessage;

exports.getBreath = getBreath;
exports.tryExpendBreath = tryExpendBreath;
