const fs = require("fs");
const path = require("path");
const https = require("https");
// Used to identify syllables during vibe garbling
const nlp = require("compromise");
const nlpSpeech = require("compromise-speech");
nlp.extend(nlpSpeech);

const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { getHeavy, heavyDenialCoefficient } = require("./heavyfunctions.js");
const { arousedtexts } = require("../vibes/aroused/aroused_texts.js");
const { config } = require("./configfunctions.js");
const { getOption, getBotOption } = require(`./configfunctions.js`);
const { getUserVar, setUserVar } = require("./usercontext.js");
const { getToys } = require("./toyfunctions.js");
const { logConsole } = require("./logfunctions.js");
const { getBaseChastity } = require("./chastityfunctions.js");
const { getHeadwear } = require("./headwearfunctions.js");

// NOTE: canUnequip is currently checked in functions that remove/assign chastity and those functions return if it succeeded, but the text responses are not yet updated
// probably makes more sense to make custom text responses for the belts/bras that use this that explain why it failed

// We can PROBABLY have this reference the chastity/defaultchastity.js function as those should just be default "nothing" values.
const NO_CHASTITY = {
	growthCoefficient: 1,
	decayCoefficient: 1,
	denialCoefficient: 1,
	timescale: 1,
	minVibe: null,
	minArousal: null,
	maxVibe: null,
	maxArousal: null,
	minGrowth: null,
	maxGrowth: null,
	minDecay: null,
	maxDecay: null,
	orgasmCooldown: 1,
	orgasmArousalLeft: 0,
	onOrgasm(user, prevArousal) { },
	onFailedOrgasm(user, prevArousal) { },
	onEquip(user) { },
	onUnequip(user) { },
	onFumble(wearer, keyholder, fumbleResult) { },
	afterArousalChange(user, prevArousal, newArousal) { },
	canUnequip(user) {
		return true;
	},
    calcVibeEffect(data) {
        return 0
    }
};
/* We can probably remove these, but leaving for reference for now.
// They have been transposed into relevant files in chastity/__/__.js
const chastitytypes = [
	{ name: "Featherlight Belt", value: "belt_featherlight", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 15, minVibe: 2, minArousal: 1 },
	{ name: "Blacksteel Chastity Belt", value: "belt_blacksteel", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 7.5 },
	{ name: "Silver Chastity Belt", value: "belt_silver", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 5 },
	{ name: "Latex Lined Chastity Belt", value: "belt_latexlined", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 5 },
	{ name: "Ancient Chastity Belt", value: "belt_ancient", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 15 },
	{ name: "Cyber Doll Belt", value: "belt_cyberdoll", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 10 },
	{ name: "Tungsten Belt", value: "belt_tungsten", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 7.5 },
	{ name: "Hardlight Belt", value: "belt_hardlight", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 10 },
	{ name: "Wolf Panties", value: "belt_wolf", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 7.5 },
	{ name: "Maid Chastity Belt", value: "belt_maid", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 10 },
	{ name: "Chastity Belt of Eternal Denial", value: "belt_eternal", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 2000 },
	{ name: "Queensbelt", value: "belt_queen", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 10 },
	{ name: "Starmetal Belt", value: "belt_starmetal", growthCoefficient: 0.5, decayCoefficient: 0.2, denialCoefficient: 7.5 },
	{ name: "Timekeeper's Belt", value: "belt_timekeeper", growthCoefficient: 0.1, decayCoefficient: 0.1, denialCoefficient: 10, timescale: 0.1, minDecay: -0.1, maxDecay: 0.1 },
	{
		name: "Stasis Prison",
		value: "belt_stasis",
		growthCoefficient: 0.5,
		decayCoefficient: 0.2,
		denialCoefficient: 5,
		onOrgasm(user, prevArousal) {
			addArousal(user, prevArousal);
			const current = getUserVar(user, "chastityoverrides")?.denialCoefficient ?? 5;
			setUserVar(user, "chastityoverrides", { denialCoefficient: current * 1.2 });
		},
		onUnequip(user) {
			setUserVar(user, "chastityoverrides", {});
		},
	},
	{
		name: "Belt of Undying Ardour",
		value: "belt_ardour",
		growthCoefficient: 2.5,
		decayCoefficient: 0.1,
		denialCoefficient: 1,
		minVibe: 3,
		orgasmCooldown: 0.05,
		orgasmArousalLeft: 0.05
	},
	{
		name: "Livingwood Belt",
		value: "belt_livingwood",
		growthCoefficient: 1,
		decayCoefficient: 0.1,
		denialCoefficient: 5,
		orgasmCooldown: 1,
		minVibe: 0,
		//Increment Vibe every 15 minutes
		minVibeFn: (user) => minVibe = Math.max(Math.min(Math.floor((Date.now() - (getUserVar(user, "livingwoodbelt") ?? Date.now())) / 900000), 20), getUserVar(user, "livingwoodvibe")),
		onOrgasm(user, prevArousal) {
			setUserVar(user, "livingwoodvibe", Math.max((minVibe -= 10), 0));
			setUserVar(user, "livingwoodbelt", Date.now());
		},
		onFailedOrgasm(user, prevArousal) {
			setUserVar(user, "livingwoodvibe", Math.min((minVibe += 1), 20));
		},
		onEquip(user) {
			setUserVar(user, "livingwoodvibe", 0);
			setUserVar(user, "livingwoodbelt", Date.now());
		},
		onUnequip(user) {
			setUserVar(user, "livingwoodvibe", {});
			setUserVar(user, "livingwoodbelt", {});
		},
		afterArousalChange(user, prevArousal, newArousal) {
			// console.log(minVibe, Math.min(Math.floor((Date.now() - (getUserVar(user, "livingwoodbelt") ?? Date.now())) / 900000), 20), Math.max(Math.min(Math.floor((Date.now() - (getUserVar(user, "livingwoodbelt") ?? Date.now())) / 900000), 20), getUserVar(user, "livingwoodvibe")));
		},
	},
];

const chastitybratypes = [
	{ name: "Featherlight Bra", value: "bra_featherlight", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 6, minVibe: 2, minArousal: 1 },
	{ name: "Blacksteel Chastity Bra", value: "bra_blacksteel", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 3 },
	{ name: "Silver Chastity Bra", value: "bra_silver", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 3 },
	{ name: "Latex Lined Chastity Bra", value: "bra_latexlined", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 3 },
	{ name: "Ancient Chastity Bra", value: "bra_ancient", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 6 },
	{ name: "Cyber Doll Bra", value: "bra_cyberdoll", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 4 },
	{ name: "Tungsten Bra", value: "bra_tungsten", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 3 },
	{ name: "Hardlight Bra", value: "bra_hardlight", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 4 },
	{ name: "Wolf Bra", value: "bra_wolf", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 3 },
	{ name: "Maid Chastity Bra", value: "bra_maid", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 3 },
	{ name: "Queensbra", value: "bra_queen", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 4 },
	{ name: "Starmetal Bra", value: "bra_starmetal", growthCoefficient: 1, decayCoefficient: 0.6, denialCoefficient: 3 },
	{
		name: "Livingwood Bra",
		value: "bra_livingwood",
		growthCoefficient: 1,
		decayCoefficient: 0.3,
		denialCoefficient: 3,
		minVibe: 0,
	},
];


const chastitytypesoptions = chastitytypes.map((chastity) => ({ name: chastity.name, value: chastity.value }));
const chastitybratypesoptions = chastitybratypes.map((chastity) => ({ name: chastity.name, value: chastity.value }));

const chastitylookup = new Map(chastitytypes.map((type) => [type.value, type]));
const chastitybralookup = new Map(chastitybratypes.map((type) => [type.value, type]));*/
const frustrationPenalties = new Map();

// the arousal under which it is treated as 0
const RESET_LIMIT = 0.1;
// the minimum arousal required for frustration to also impact speach
const STUTTER_LIMIT = 1;
// the arousal needed for an unbelted user to orgasm
const ORGASM_LIMIT = 10;
// the rate of arousal decay without orgasms when unbelted
const UNBELTED_DECAY = 0.2;
// the maximum frustration that can be reached
const MAX_FRUSTRATION = 50;
// by how much arousal randomness is biased upwards
const RANDOM_BIAS = 1;
// by how much vibe intensity is scaled for the arousal model
const VIBE_SCALING = 0.6;
// the rate frustration grows at while belted
const FRUSTRATION_COEFFICIENT = 1.06;
// the portion of maximum frustration where the growth rate reduces
const FRUSTRATION_BREAKPOINT = 0.7;
const FRUSTRATION_BREAKPOINT_TIME = Math.log(FRUSTRATION_BREAKPOINT * MAX_FRUSTRATION) / Math.log(FRUSTRATION_COEFFICIENT);
// the rate frustration reaches the maximum after the breakpoint
const FRUSTRATION_MAX_COEFFICIENT = 6;
// the minimum time between successful orgasms
const ORGASM_COOLDOWN = 60 * 1000;
// the frustration increase caused by failed orgasms
const ORGASM_FRUSTRATION = 5;
const AROUSAL_STEP_SIZE = Number(process.env.AROUSALSTEPSIZE ?? "6000") ?? 6000;
const AROUSAL_STEP_SIZE_SCALING = AROUSAL_STEP_SIZE / 60000; // This just aint even used. 
// how large an impact the arousal variance has
const AROUSAL_PERIOD_AMPLITUDE = 0.3;
// the inverses of the period lengths used for arousal variance. The lengths should be coprime
const AROUSAL_PERIOD_A = 1 / 19;
const AROUSAL_PERIOD_B = 1 / 33;
// how much repeated frustration penalties are compounded
const PENALTY_MULTIPLIER = 1.3;

const assignChastity = (user, keyholder, namedchastity, force = false) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
    // Get the current and new bases to reference
    let oldchastitybase = getChastity(user) ? getBaseChastity(getChastity(user).chastitytype) : undefined;
    let newchastitybase = getBaseChastity(namedchastity ?? "belt_silver")

    // Stop this function immediately if the current chastity belt can't be removed. 
    // If there is none worn, no worries! 
    if ((oldchastitybase && !oldchastitybase.canUnequip({ userID: user, keyholderID: keyholder })) && !force) { return false };

    // Call the on unequip for existing chastity if relevant. 
    if (oldchastitybase) { oldchastitybase.onUnequip({ userID: user, keyholderID: keyholder }) }

    // Assign the new chastity belt to the user
	process.chastity[user] = { keyholder: keyholder ? keyholder : "unlocked", timestamp: Date.now(), chastitytype: namedchastity };

    // Call the on equip for the new chastity belt!
    newchastitybase.onEquip({ userID: user, keyholderID: keyholder })

	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;
	return true;
};

const getChastity = (user) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	return process.chastity[user];
};

const removeChastity = (user, force = false) => {
	if (process.chastity == undefined) {
		process.chastity = {};
    }
    let chastitybase = getBaseChastity(getChastity(user)?.chastitytype ?? "belt_silver")

	if ((chastitybase && !chastitybase.canUnequip({ userID: user })) && !force) return false;

	chastitybase.onUnequip({ userID: user });

	delete process.chastity[user];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;

	return true;
};

const assignChastityBra = (user, keyholder, namedchastity, force = false) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
    // Get the current and new bases to reference
    let oldchastitybase = getChastityBra(user) ? getBaseChastity(getChastityBra(user).chastitytype) : undefined
    let newchastitybase = getBaseChastity(namedchastity ?? "bra_silver")

    // Stop this function immediately if the current chastity belt can't be removed. 
    // If there is none worn, no worries! 
    if ((oldchastitybase && !oldchastitybase.canUnequip({ userID: user, keyholderID: keyholder })) && !force) { return false };

    // Call the on unequip for existing chastity if relevant. 
    if (oldchastitybase) { oldchastitybase.onUnequip({ userID: user, keyholderID: keyholder }) }

    // Assign the new chastity belt to the user
	process.chastitybra[user] = { keyholder: keyholder ? keyholder : "unlocked", timestamp: Date.now(), chastitytype: namedchastity };

    // Call the on equip for the new chastity belt!
    newchastitybase.onEquip({ userID: user, keyholderID: keyholder })

	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastitybra = true;
	return true;
};

const getChastityBra = (user) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	return process.chastitybra[user];
};

const removeChastityBra = (user, force = false) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
    }
    let chastitybase = getBaseChastity(getChastityBra(user)?.chastitytype ?? "bra_silver")

	if ((chastitybase && !chastitybase.canUnequip({ userID: user })) && !force) return false;

	chastitybase.onUnequip({ userID: user });

	delete process.chastitybra[user];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastitybra = true;

	return true;
};

function swapChastity(user, namedchastity) {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
    let chastitybase = getBaseChastity(getChastity(user).chastitytype ?? "belt_silver")
	if (chastitybase && !chastitybase.canUnequip({ userID: user })) return false;
	chastitybase.onUnequip({ userID: user });
	process.chastity[user].chastitytype = namedchastity;
	let newchastitybase = getBaseChastity(namedchastity)
	newchastitybase.onEquip({ userID: user });
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;
	return true;
}

function swapChastityBra(user, namedchastity) {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let chastitybase = getBaseChastity(getChastityBra(user).chastitytype ?? "bra_silver")
	if (chastitybase && !chastitybase.canUnequip({ userID: user })) return false;
	chastitybase.onUnequip({ userID: user });
	process.chastitybra[user].chastitytype = namedchastity;
	let newchastitybase = getBaseChastity(namedchastity)
	newchastitybase.onEquip({ userID: user });
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastitybra = true; // I will need to merge all those readytosave flags into their own functions. this is a hazard to write - NBS
	return true;
}

const assignVibe = (user, intensity, vibetype = "bullet vibe", origbinder) => {
	if (config.getDisableVibes(user)) return;
	if (process.vibe == undefined) {
		process.vibe = {};
	}
	let originalbinder = process.vibe[user]?.origbinder; // ... well I was gonna finish vibe code but this needs a bigger rework
	if (!process.vibe[user]) {
		process.vibe[user] = [{ vibetype: vibetype, intensity: intensity }];
		addArousal(user, intensity / 2);
	} else {
		const existingVibe = process.vibe[user].find((v) => v.vibetype === vibetype);
		if (existingVibe) {
			existingVibe.intensity = intensity;
		} else {
			process.vibe[user].push({ vibetype: vibetype, intensity: intensity });
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.vibe = true;
};

const getVibe = (user) => {
	if (process.vibe == undefined) {
		process.vibe = {};
	}
	return process.vibe[user];
};

const removeVibe = (user, vibetype) => {
	if (process.vibe == undefined) {
		process.vibe = {};
	}
	if (!vibetype) {
		delete process.vibe[user];
	} else {
		process.vibe[user] = process.vibe[user].filter((v) => v.vibetype !== vibetype);
		if (process.vibe[user].length == 0) {
			delete process.vibe[user]; // Discard the vibes object as we are no longer using it.
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.vibe = true;
};

const getChastityKeys = (user) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	let keysheld = [];
	Object.keys(process.chastity).forEach((k) => {
		if ((process.chastity[k].keyholder == user) && (!process.chastity[k]?.fumbled)) {
			keysheld.push(k);
		}
	});
	return keysheld;
};

const getChastityName = (userID, chastityname) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	let convertchastityarr = {};
	for (let i = 0; i < process.autocompletes.chastitybelt.length; i++) {
		convertchastityarr[process.autocompletes.chastitybelt[i].value] = process.autocompletes.chastitybelt[i].name;
	}
	if (chastityname) {
		return convertchastityarr[chastityname];
	} else if (process.chastity[userID]?.chastitytype) {
		return convertchastityarr[process.chastity[userID]?.chastitytype];
	} else {
		return undefined;
	}
};

const getChastityBraKeys = (user) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let keysheld = [];
	Object.keys(process.chastitybra).forEach((k) => {
		if ((process.chastitybra[k].keyholder == user) && (!process.chastity[k]?.fumbled)) {
			keysheld.push(k);
		}
	});
	return keysheld;
};

const getChastityBraName = (userID, chastityname) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let convertchastityarr = {};
	for (let i = 0; i < process.autocompletes.chastitybra.length; i++) {
		convertchastityarr[process.autocompletes.chastitybra[i].value] = process.autocompletes.chastitybra[i].name;
	}
	if (chastityname) {
		return convertchastityarr[chastityname];
	} else if (process.chastitybra[userID]?.chastitytype) {
		return convertchastityarr[process.chastitybra[userID]?.chastitytype];
	} else {
		return undefined;
	}
};

// Returns UNIX timestring of the wearer's unlock time.
// second flag to true to return a Discord UNIX timestring instead.
const getChastityTimelock = (user, UNIXTimestring) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	if (!UNIXTimestring) {
		return process.chastity[user]?.unlockTime;
	} else {
		if (process.chastity[user]?.unlockTime) {
			return `<t:${Math.floor(process.chastity[user]?.unlockTime / 1000)}:f>`;
		} else {
			return null;
		}
	}
};

// Returns UNIX timestring of the wearer's unlock time.
// second flag to true to return a Discord UNIX timestring instead.
const getChastityBraTimelock = (user, UNIXTimestring) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	if (!UNIXTimestring) {
		return process.chastitybra[user]?.unlockTime;
	} else {
		if (process.chastitybra[user]?.unlockTime) {
			return `<t:${Math.floor(process.chastitybra[user]?.unlockTime / 1000)}:f>`;
		} else {
			return null;
		}
	}
};

const getChastityKeyholder = (user) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	return process.chastity[user]?.keyholder;
};

const getChastityBraKeyholder = (user) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	return process.chastitybra[user]?.keyholder;
};

function getCombinedTraits(user) {
    // Build an object which references the combined properties
    // Any FUNCTIONS will be called from both when their respective unlock is called.
    const beltbase = getChastity(user) ? getBaseChastity(getChastity(user).chastitytype ?? "belt_silver") : undefined;
    const brabase = getChastityBra(user) ? getBaseChastity(getChastityBra(user).chastitytype ?? "bra_silver") : undefined;
	if (!beltbase && !brabase) return NO_CHASTITY;
    let datatopass = {
        userID: user
    }
    // Because the usual stuff found in return object are typically referenced NOT as functions, we're gonna
    // parse them here. I don't think this is the best solution, admittedly, but it should suffice.
    let singlebase;
	if (!brabase) singlebase = Object.assign({}, beltbase);
	if (!beltbase) singlebase = Object.assign({}, brabase);
    if (singlebase) {
        let props = ["growthCoefficient", "decayCoefficient", "denialCoefficient",
                    "timescale", "minVibe", "maxVibe",
                    "minArousal", "maxArousal", "minGrowth",
                    "maxGrowth", "minDecay", "maxDecay",
                    "orgasmCooldown", "orgasmArousalLeft"]
        props.forEach((p) => {
            singlebase[p] = singlebase[p](datatopass)
        })
        return singlebase;
    }
    let returnobject = {
        growthCoefficient: beltbase.growthCoefficient(datatopass) * brabase.growthCoefficient(datatopass),
		decayCoefficient: beltbase.decayCoefficient(datatopass) * brabase.decayCoefficient(datatopass),
		denialCoefficient: beltbase.denialCoefficient(datatopass) + brabase.denialCoefficient(datatopass),
		timescale: beltbase.timescale(datatopass) * brabase.timescale(datatopass),
		minVibe: max(beltbase.minVibe(datatopass), brabase.minVibe(datatopass)),
		maxVibe: min(beltbase.maxVibe(datatopass), brabase.maxVibe(datatopass)),
		minArousal: max(beltbase.minArousal(datatopass), brabase.minArousal(datatopass)),
		maxArousal: min(beltbase.maxArousal(datatopass), brabase.maxArousal(datatopass)),
		minGrowth: max(beltbase.minGrowth(datatopass), brabase.minGrowth(datatopass)),
		maxGrowth: min(beltbase.maxGrowth(datatopass), brabase.maxGrowth(datatopass)),
		minDecay: max(beltbase.minDecay(datatopass), brabase.minDecay(datatopass)),
		maxDecay: min(beltbase.maxDecay(datatopass), brabase.maxDecay(datatopass)),
		orgasmCooldown: beltbase.orgasmCooldown(datatopass) * brabase.orgasmCooldown(datatopass),
		orgasmArousalLeft: beltbase.orgasmArousalLeft(datatopass) + brabase.orgasmArousalLeft(datatopass),
    }
    // Add each function defined on the base object! (defaultchastity.js)
    let props = Object.getOwnPropertyNames(beltbase)
    props.forEach((f) => {
        if ((typeof beltbase[f] === "function") && (f.startsWith("on"))) {
            returnobject[f] = function (data) {
                beltbase[f](data);
                brabase[f](data);
            }
        }
        // canEquip and canUnlock, maybe eventually add other stuff like canOrgasm :D
        if ((typeof beltbase[f] === "function") && (f.startsWith("can"))) {
            returnobject[f] = function (data) {
                return beltbase[f](data) && brabase[f](data)
            }
        }
    })
    // Extra props that aren't listed
    // Note, fumbles are NOT listed here, but we can add them later if needed. 
    returnobject.afterArousalChange = function (data) {
        beltbase.afterArousalChange(data);
        brabase.afterArousalChange(data);
    }
    // Arousal gain as if wearer is wearing vibes - used for featherlight
    returnobject.calcVibeEffect = function (data) {
        let sum = 0;
        sum = sum + beltbase.calcVibeEffect(data)
        sum = sum + brabase.calcVibeEffect(data)
        return sum;
    }
	return returnobject;
}

// Returns an object you can check the .access prop of.
// Unlock actions should set the third param true to ensure
// that users are not unlocking public access.
const canAccessChastity = (chastityuser, keyholder, unlock, cloning) => {
	// As a reference for access in timelocks:
	// 0: "Everyone Else"
	// 1: "Keyholder Only"
	// 2: "Nobody"

	let accessval = { access: false, public: false, hasbelt: true };
	// no belt, no need
	if (!getChastity(chastityuser)) {
		accessval.hasbelt = false;
		return accessval;
	}
	// Sealed Belt - nobody gets in!
	if (getChastity(chastityuser)?.access == 2) {
		return accessval;
	}
	// If unlock is set, only allow access to unlock if the keyholder is the correct one.
	if (unlock) {
		// Allow unlocks by a non-self keyholder at all times, assuming its not sealed.
		if (getChastity(chastityuser)?.access != 2 && getChastity(chastityuser)?.keyholder == keyholder && keyholder != chastityuser && !getChastityBra(chastityuser)?.fumbled) {
			accessval.access = true;
		}
		// Allow unlocks by any keyholder if no timelock if the key isn't fumbled!
		if (getChastity(chastityuser)?.access == undefined && getChastity(chastityuser)?.keyholder == keyholder && !getChastity(chastityuser)?.fumbled) {
			accessval.access = true;
		}
		// Allow unlocks by secondary keyholder if no timelock
		let clonedkeys = getChastity(chastityuser)?.clonedKeyholders ?? [];
		if (getChastity(chastityuser)?.access == undefined && clonedkeys.includes(keyholder)) {
			accessval.access = true;
		}
		// Else, return false.

		return accessval;
	}
	// If Cloning is set, parse specific instructions for that.
	if (cloning) {
		// Primary Keyholder access only if set to 0.
		if (getChastity(chastityuser)?.access == 0 && keyholder != chastityuser) {
			accessval.access = true;
			accessval.public = true;
		}
		// Keyholder access if access is unset (no timelocks) and the key isnt fumbled
		if (getChastity(chastityuser)?.access == undefined && getChastity(chastityuser)?.keyholder == keyholder && !getChastity(chastityuser)?.fumbled) {
			accessval.access = true;
		}
		// Keyholder access if timelock is 1 (keyholder only) but only if not self and if key isnt fumbled.
		if (getChastity(chastityuser)?.access == 1 && getChastity(chastityuser)?.keyholder == keyholder && chastityuser != keyholder  && !getChastity(chastityuser)?.fumbled) {
			accessval.access = true;
		}

		return accessval;
	}
	// Others access only when access is set to 0.
	if (getChastity(chastityuser)?.access == 0 && keyholder != chastityuser) {
		accessval.access = true;
		accessval.public = true;
	}
	// Keyholder access if access is unset (no timelocks) and not fumbled
	if (getChastity(chastityuser)?.access == undefined && getChastity(chastityuser)?.keyholder == keyholder && !getChastity(chastityuser)?.fumbled) {
		accessval.access = true;
	}
	// Secondary Keyholder access (cloned key), but only if cloning is NOT true and no timelocks
	let clonedkeys = getChastity(chastityuser)?.clonedKeyholders ?? [];
	if (clonedkeys.includes(keyholder) && getChastity(chastityuser)?.access == undefined) {
		accessval.access = true;
	}
	// Keyholder access if timelock is 1 (keyholder only) but only if not self and not fumbled
	if (getChastity(chastityuser)?.access == 1 && getChastity(chastityuser)?.keyholder == keyholder && chastityuser != keyholder  && !getChastity(chastityuser)?.fumbled) {
		accessval.access = true;
	}
	// Secondary Keyholder access (cloned key) if access is 1, but only if not self.
	if (clonedkeys.includes(keyholder) && getChastity(chastityuser)?.access == 1 && chastityuser != keyholder) {
		accessval.access = true;
	}
	// Else, return false.

	return accessval;
};

// Returns an object you can check the .access prop of.
// Unlock actions should set the third param true to ensure
// that users are not unlocking public access.
const canAccessChastityBra = (chastityuser, keyholder, unlock, cloning) => {
	// As a reference for access in timelocks:
	// 0: "Everyone Else"
	// 1: "Keyholder Only"
	// 2: "Nobody"

	let accessval = { access: false, public: false, hasbelt: true };
	// no belt, no need
	if (!getChastityBra(chastityuser)) {
		accessval.hasbelt = false;
		return accessval;
	}
	// Sealed Belt - nobody gets in!
	if (getChastityBra(chastityuser)?.access == 2) {
		return accessval;
	}
	// If unlock is set, only allow access to unlock if the keyholder is the correct one.
	if (unlock) {
		// Allow unlocks by a non-self keyholder at all times, assuming its not sealed.
		if (getChastityBra(chastityuser)?.access != 2 && getChastityBra(chastityuser)?.keyholder == keyholder && keyholder != chastityuser && !getChastityBra(chastityuser)?.fumbled) {
			accessval.access = true;
		}
		// Allow unlocks by any keyholder if no timelock and not fumbled.
		if (getChastityBra(chastityuser)?.access == undefined && getChastityBra(chastityuser)?.keyholder == keyholder && !getChastityBra(chastityuser)?.fumbled) {
			accessval.access = true;
		}
		// Allow unlocks by secondary keyholder if no timelock
		let clonedkeys = getChastityBra(chastityuser)?.clonedKeyholders ?? [];
		if (getChastityBra(chastityuser)?.access == undefined && clonedkeys.includes(keyholder)) {
			accessval.access = true;
		}
		// Else, return false.

		return accessval;
	}
	// If Cloning is set, parse specific instructions for that.
	if (cloning) {
		// Primary Keyholder access only if set to 0.
		if (getChastityBra(chastityuser)?.access == 0 && keyholder != chastityuser) {
			accessval.access = true;
			accessval.public = true;
		}
		// Keyholder access if access is unset (no timelocks)
		if (getChastityBra(chastityuser)?.access == undefined && getChastityBra(chastityuser)?.keyholder == keyholder && !getChastityBra(chastityuser)?.fumbled) {
			accessval.access = true;
		}
		// Keyholder access if timelock is 1 (keyholder only) but only if not self.
		if (getChastityBra(chastityuser)?.access == 1 && getChastityBra(chastityuser)?.keyholder == keyholder && chastityuser != keyholder && !getChastityBra(chastityuser)?.fumbled) {
			accessval.access = true;
		}

		return accessval;
	}
	// Others access only when access is set to 0.
	if (getChastityBra(chastityuser)?.access == 0 && keyholder != chastityuser) {
		accessval.access = true;
		accessval.public = true;
	}
	// Keyholder access if access is unset (no timelocks)
	if (getChastityBra(chastityuser)?.access == undefined && getChastityBra(chastityuser)?.keyholder == keyholder && !getChastityBra(chastityuser)?.fumbled) {
		accessval.access = true;
	}
	// Secondary Keyholder access (cloned key), but only if cloning is NOT true and no timelocks
	let clonedkeys = getChastityBra(chastityuser)?.clonedKeyholders ?? [];
	if (clonedkeys.includes(keyholder) && getChastityBra(chastityuser)?.access == undefined) {
		accessval.access = true;
	}
	// Keyholder access if timelock is 1 (keyholder only) but only if not self.
	if (getChastityBra(chastityuser)?.access == 1 && getChastityBra(chastityuser)?.keyholder == keyholder && chastityuser != keyholder && !getChastityBra(chastityuser)?.fumbled) {
		accessval.access = true;
	}
	// Secondary Keyholder access (cloned key) if access is 1, but only if not self.
	if (clonedkeys.includes(keyholder) && getChastityBra(chastityuser)?.access == 1 && chastityuser != keyholder) {
		accessval.access = true;
	}
	// Else, return false.

	return accessval;
};

// Called to prompt the wearer if it is okay to clone a key.
async function promptCloneChastityKey(user, target, clonekeyholder, bra) {
	return new Promise(async (res, rej) => {
		let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
		let dmchannel = await target.createDM();
		await dmchannel.send({ content: `${user} would like to give ${clonekeyholder} a copy of your chastity belt key. Do you want to allow this?`, components: [new ActionRowBuilder().addComponents(...buttons)] }).then((mess) => {
			// Create a collector for up to 30 seconds
			const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

			collector.on("collect", async (i) => {
				console.log(i);
				if (i.customId == "acceptButton") {
					await mess.delete().then(() => {
						i.reply(`Confirmed - ${clonekeyholder} will receive a copied key for your chastity belt!`);
					});
					res(true);
				} else {
					await mess.delete().then(() => {
						i.reply(`Rejected - ${clonekeyholder} will NOT receive a copied key for your chastity belt!`);
					});
					rej(true);
				}
			});

			collector.on("end", async (collected) => {
				// timed out
				if (collected.length == 0) {
					await mess.delete().then(() => {
						i.reply(`Timed Out - ${clonekeyholder} will NOT receive a copied key for your chastity belt!`);
					});
					rej(true);
				}
			});
		});
	});
}

// Called to prompt the wearer if it is okay to give a key.
async function promptTransferChastityKey(user, target, newKeyholder) {
	return new Promise(async (res, rej) => {
		try {
			let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
			let dmchannel = await target.createDM();
			await dmchannel.send({ content: `${user} would like to give ${newKeyholder} your chastity belt key. Do you want to allow this?`, components: [new ActionRowBuilder().addComponents(...buttons)] }).then((mess) => {
				// Create a collector for up to 30 seconds
				const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

				collector.on("collect", async (i) => {
					console.log(i);
					if (i.customId == "acceptButton") {
						await mess.delete().then(() => {
							i.reply(`Confirmed - ${newKeyholder} will receive the key for your chastity belt!`);
						});
						res(true);
					} else {
						await mess.delete().then(() => {
							i.reply(`Rejected - ${newKeyholder} will NOT receive the key for your chastity belt!`);
						});
						rej(true);
					}
				});

				collector.on("end", async (collected) => {
					// timed out
					if (collected.length == 0) {
						await mess.delete().then(() => {
							i.reply(`Timed Out - ${newKeyholder} will NOT receive the key for your chastity belt!`);
						});
						rej(true);
					}
				});
			});
		} catch (err) {
			console.log(`No DMs available for ${target}`);
			rej("NoDM");
		}
	});
}

// Called to prompt the wearer if it is okay to clone a key.
async function promptCloneChastityBraKey(user, target, clonekeyholder) {
	return new Promise(async (res, rej) => {
        try {
            let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
            let dmchannel = await target.createDM();
            await dmchannel.send({ content: `${user} would like to give ${clonekeyholder} a copy of your chastity bra key. Do you want to allow this?`, components: [new ActionRowBuilder().addComponents(...buttons)] }).then((mess) => {
                // Create a collector for up to 30 seconds
                const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

                collector.on("collect", async (i) => {
                    console.log(i);
                    if (i.customId == "acceptButton") {
                        await mess.delete().then(() => {
                            i.reply(`Confirmed - ${clonekeyholder} will receive a copied key for your chastity bra!`);
                        });
                        res(true);
                    } else {
                        await mess.delete().then(() => {
                            i.reply(`Rejected - ${clonekeyholder} will NOT receive a copied key for your chastity bra!`);
                        });
                        rej(true);
                    }
                });

                collector.on("end", async (collected) => {
                    // timed out
                    if (collected.length == 0) {
                        await mess.delete().then(() => {
                            i.reply(`Timed Out - ${clonekeyholder} will NOT receive a copied key for your chastity bra!`);
                        });
                        rej(true);
                    }
                });
            });
        } catch (err) {
			console.log(`No DMs available for ${target}`);
			rej("NoDM");
		}
	});
}

// Called to prompt the wearer if it is okay to give a key.
async function promptTransferChastityBraKey(user, target, newKeyholder) {
	return new Promise(async (res, rej) => {
		try {
			let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
			let dmchannel = await target.createDM();
			await dmchannel.send({ content: `${user} would like to give ${newKeyholder} your chastity bra key. Do you want to allow this?`, components: [new ActionRowBuilder().addComponents(...buttons)] }).then((mess) => {
				// Create a collector for up to 30 seconds
				const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

				collector.on("collect", async (i) => {
					console.log(i);
					if (i.customId == "acceptButton") {
						await mess.delete().then(() => {
							i.reply(`Confirmed - ${newKeyholder} will receive the key for your chastity bra!`);
						});
						res(true);
					} else {
						await mess.delete().then(() => {
							i.reply(`Rejected - ${newKeyholder} will NOT receive the key for your chastity bra!`);
						});
						rej(true);
					}
				});

				collector.on("end", async (collected) => {
					// timed out
					if (collected.length == 0) {
						await mess.delete().then(() => {
							i.reply(`Timed Out - ${newKeyholder} will NOT receive the key for your chastity bra!`);
						});
						rej(true);
					}
				});
			});
		} catch (err) {
			console.log(`No DMs available for ${target}`);
			rej("NoDM");
		}
	});
}

// Called once we confirm the user is okay with it!
// For cloned keys, we want to allow a cloned key to do everything except
// giving the key or cloning the key. These actions should check the
// fourth param of the canAccessCollar function and set it to true
// when the action needs to REJECT cloned keys.
const cloneChastityKey = (chastityuser, newKeyholder) => {
	let chastity = getChastity(chastityuser);
	if (!chastity.clonedKeyholders) {
		chastity.clonedKeyholders = [];
	}
	chastity.clonedKeyholders.push(newKeyholder);
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;
};

// Called once we confirm the user is okay with it!
// For cloned keys, we want to allow a cloned key to do everything except
// giving the key or cloning the key. These actions should check the
// fourth param of the canAccessCollar function and set it to true
// when the action needs to REJECT cloned keys.
const cloneChastityBraKey = (chastityuser, newKeyholder) => {
	let chastity = getChastityBra(chastityuser);
	if (!chastity.clonedKeyholders) {
		chastity.clonedKeyholders = [];
	}
	chastity.clonedKeyholders.push(newKeyholder);
	console.log("CLONED");
	console.log(chastity);
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastitybra = true;
};

// Called to remove a single cloned keyholder from the list.
const revokeChastityKey = (chastityuser, newKeyholder) => {
	let chastity = getChastity(chastityuser);
	if (!chastity.clonedKeyholders) {
		chastity.clonedKeyholders = [];
	}
	if (chastity.clonedKeyholders.includes(newKeyholder)) {
		chastity.clonedKeyholders.splice(chastity.clonedKeyholders.indexOf(newKeyholder), 1);
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;
};

// Called to remove a single cloned keyholder from the list.
const revokeChastityBraKey = (chastityuser, newKeyholder) => {
	let chastity = getChastityBra(chastityuser);
	if (!chastity.clonedKeyholders) {
		chastity.clonedKeyholders = [];
	}
	if (chastity.clonedKeyholders.includes(newKeyholder)) {
		chastity.clonedKeyholders.splice(chastity.clonedKeyholders.indexOf(newKeyholder), 1);
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;
};

// Called to get cloned keys on a restraint
const getClonedChastityKey = (userID) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	let returnval = process.chastity[userID]?.clonedKeyholders ?? [];
	return returnval;
};

// Called to get cloned keys on a restraint
const getClonedChastityBraKey = (userID) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let returnval = process.chastitybra[userID]?.clonedKeyholders ?? [];
	return returnval;
};

// Called to get cloned keys held by userID
// Returns a list in format: [USERID_type]
const getClonedChastityKeysOwned = (userID) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	let ownedkeys = [];
	Object.keys(process.chastity).forEach((k) => {
		if (process.chastity[k].clonedKeyholders) {
			if (process.chastity[k].clonedKeyholders.includes(userID)) {
				ownedkeys.push(`${k}_chastitybelt`);
			}
		}
	});
	return ownedkeys;
};

// Called to get cloned keys held by userID
// Returns a list in format: [USERID_type]
const getClonedChastityBraKeysOwned = (userID) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let ownedkeys = [];
	Object.keys(process.chastitybra).forEach((k) => {
		if (process.chastitybra[k].clonedKeyholders) {
			if (process.chastitybra[k].clonedKeyholders.includes(userID)) {
				ownedkeys.push(`${k}_chastitybra`);
			}
		}
	});
	return ownedkeys;
};

// Called to get cloned keys from restraints the keyholder is primary for
// Returns a list in format: [wearerID_clonedKeyholderID]
const getOtherKeysChastity = (userID) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	let ownedkeys = [];
	Object.keys(process.chastity).forEach((k) => {
		if (process.chastity[k].keyholder == userID) {
			if (process.chastity[k].clonedKeyholders) {
				process.chastity[k].clonedKeyholders.forEach((c) => {
					ownedkeys.push(`${k}_${c}`);
				});
			}
		}
	});
	return ownedkeys;
};

// Called to get cloned keys from restraints the keyholder is primary for
// Returns a list in format: [wearerID_clonedKeyholderID]
const getOtherKeysChastityBra = (userID) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	let ownedkeys = [];
	Object.keys(process.chastitybra).forEach((k) => {
		if (process.chastitybra[k].keyholder == userID) {
			if (process.chastitybra[k].clonedKeyholders) {
				process.chastitybra[k].clonedKeyholders.forEach((c) => {
					ownedkeys.push(`${k}_${c}`);
				});
			}
		}
	});
	return ownedkeys;
};

// transfer keys and returns whether the transfer was successful
const transferChastityKey = (lockedUser, newKeyholder) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	if (process.chastity[lockedUser]) {
		if (process.chastity[lockedUser].keyholder != newKeyholder) {
			process.chastity[lockedUser].keyholder = newKeyholder;
			process.chastity[lockedUser].clonedKeyholders = [];
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.chastity = true;
			return true;
		}
	}

	return false;
};

const discardChastityKey = (user, locker) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	if (process.discardedKeys == undefined) {
		process.discardedKeys = [];
	}
	let typelocked = "none";
	if (process.chastity[user]) {
		if (process.chastity[user].keyholder == locker) {
			// Lost their own *primary* chastity keys
			process.chastity[user].keyholder = "discarded";
			process.chastity[user].clonedKeyholders = [];
			process.discardedKeys.push({ restraint: "chastity belt", wearer: user });
			typelocked = "keyholder";
		} else if (process.chastity[user].clonedKeyholders.includes(locker)) {
			// Lost a clone. Clones will simply disappear.
			process.chastity[user].clonedKeyholders.splice(process.chastity[user].clonedKeyholders.indexOf(locker), 1);
			typelocked = "clone";
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;
	process.readytosave.discardedKeys = true;
	return typelocked;
};

const findChastityKey = (index, newKeyholder) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	if (process.discardedKeys == undefined) {
		process.discardedKeys = [];
	}
	const chastity = process.discardedKeys.splice(index, 1);
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.discardedKeys = true;
	if (chastity.length < 1) return false;
	if (process.chastity[chastity[0].wearer]) {
		process.chastity[chastity[0].wearer].keyholder = newKeyholder;
		process.chastity[chastity[0].wearer].clonedKeyholders = [];
		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		process.readytosave.chastity = true;
		return true;
	}
	return false;
};

// transfer keys and returns whether the transfer was successful
const transferChastityBraKey = (lockedUser, newKeyholder) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	if (process.chastitybra[lockedUser]) {
		if (process.chastitybra[lockedUser].keyholder != newKeyholder) {
			process.chastitybra[lockedUser].keyholder = newKeyholder;
			process.chastitybra[lockedUser].clonedKeyholders = [];
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.chastitybra = true;
			return true;
		}
	}

	return false;
};

const discardChastityBraKey = (user, locker) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	if (process.discardedKeys == undefined) {
		process.discardedKeys = [];
	}
	let typelocked = "none";
	if (process.chastitybra[user]) {
		if (process.chastitybra[user].keyholder == locker) {
			// Lost their own *primary* chastity keys
			process.chastitybra[user].keyholder = "discarded";
			process.chastitybra[user].clonedKeyholders = [];
			process.discardedKeys.push({ restraint: "chastity bra", wearer: user });
			typelocked = "keyholder";
		} else if (process.chastitybra[user].clonedKeyholders.includes(locker)) {
			// Lost a clone. Clones will simply disappear.
			process.chastitybra[user].clonedKeyholders.splice(process.chastitybra[user].clonedKeyholders.indexOf(locker), 1);
			typelocked = "clone";
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;
	process.readytosave.discardedKeys = true;
	return typelocked;
};

const findChastityBraKey = (index, newKeyholder) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	if (process.discardedKeys == undefined) {
		process.discardedKeys = [];
	}
	const chastity = process.discardedKeys.splice(index, 1);
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.discardedKeys = true;
	if (chastity.length < 1) return false;
	if (process.chastitybra[chastity[0].wearer]) {
		process.chastitybra[chastity[0].wearer].keyholder = newKeyholder;
		process.chastitybra[chastity[0].wearer].clonedKeyholders = [];
		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		process.readytosave.chastitybra = true;
		return true;
	}
	return false;
};

function getArousedTexts(user) {
	const texts = [];

	if (config.getDynamicArousal(user)) {
		const arousal = process.arousal[user];
		const current = arousal.arousal;
		const change = arousal.arousal - arousal.prev;
		for (const [min, max, minChange, maxChange, text] of arousedtexts) {
			if ((min < 0 || min <= current) && (max < 0 || max >= current) && (minChange < 0 || minChange <= change) && (maxChange < 0 || maxChange >= change)) texts.push(text);
		}
	} else {
		const arousal = calcStaticVibeIntensity(user);

		for (const [min, max, _0, _1, text] of arousedtexts) {
			if ((min < 0 || min <= arousal) && (max < 0 || max >= arousal)) texts.push(text);
		}
	}

	return texts;
}

// Given a string, randomly provides a stutter and rarely provides an arousal text per word.
// Doll Edit - Uses  characters to prevent triggering doll protocol on stutters.
// Doll Edit - Wraps italics in  so they are not separated by the doll visor.
function stutterText(msg, text, intensity, arousedtexts) {
	let newtextparts = text.split(" ");
	let outtext = "";
	let stuttered = false;
	let usermod = getOption(msg.author.id, "arousaleffectpotency") ?? 1.0;
	let overcorrected = 3;
	console.log(intensity);
	// js is a disaster sometimes. And Im a terrible coder.
	if (isNaN(usermod) || usermod > 2.0 || usermod < 0.33) {
		usermod == 1.0;
	}
	for (let i = 0; i < newtextparts.length; i++) {
		let parttomodify = newtextparts[i];
		// If this is a discord username, use the clean version of the username.
		// This will require an async.
		if (/<@!?(\d+)>/.test(parttomodify)) {
		}
		let stuttertextsyllables = nlp(newtextparts[i]).compute("syllables");
		stuttertextsyllables = stuttertextsyllables.terms().json()[0]; // We only have one word in the part!
		if (stuttertextsyllables && stuttertextsyllables.terms[0]) {
			stuttertextsyllables = stuttertextsyllables.terms[0].syllables;
		} else {
			stuttertextsyllables = []; // We dont have a syllable somehow I guess
		}
		let nosyllable = false;
		// If the syllable is undefined, because stuff broke, don't bother with it.
		if (stuttertextsyllables[0] == undefined) {
			nosyllable = true;
		}
		let modifiedpart = "";
		let modified = false;

		// Let pre-arousalchoices be 0.00 up to 1.00 divided equally, where full arousal is achieved at 40 arousal
		// and scales based on arousaleffectpotency. Remainder over the top will be no arousal text.
		let prearousalchoicethresh = Math.min((intensity / (40 * overcorrected) / 4) * usermod, 0.25);
		let prearousalmathroll = Math.random();
		let prearousalcumulative = 0 + prearousalchoicethresh;
		// Modifier 1 - 0.0-0.25 - First syllable stutter. In-indication
		if (prearousalmathroll < prearousalcumulative && !nosyllable) {
			stuttered = true;
			modified = true;
			let gasptexts = ["*gasp*", "*pant*", "*shudder*", "*shiver*"];
			let chosengasptext = `${gasptexts[Math.floor(Math.random() * gasptexts.length)]}`;
			modifiedpart = `${modifiedpart}${parttomodify.charAt(0)}...${chosengasptext}-`;
		}
		prearousalcumulative = prearousalcumulative + prearousalchoicethresh;
		// Modifier 2 - 0.25-0.50 - First syllable stammer, with pause and letter. In...I-Indication
		if (!modified && prearousalmathroll < prearousalcumulative && !nosyllable) {
			stuttered = true;
			modified = true;
			modifiedpart = `${modifiedpart}${stuttertextsyllables[0]}-`;
		}
		prearousalcumulative = prearousalcumulative + prearousalchoicethresh;
		// Modifier 3 - 0.50-0.75 - Stutter up to a base of 6 times, depending on user options.  I-I-I-I-Indication
		if (!modified && prearousalmathroll < prearousalcumulative && !nosyllable) {
			stuttered = true;
			modified = true;
			stuttertimes = Math.min(intensity / 10, 6) * usermod;
			for (let y = 0; y < Math.min(Math.floor((Math.random() + 0.5) * stuttertimes), stuttertimes); y++) {
				modifiedpart = `${modifiedpart}${parttomodify.charAt(0)}-`;
			}
			modifiedpart = `${modifiedpart}`;
		}
		prearousalcumulative = prearousalcumulative + prearousalchoicethresh;
		// Modifier 4 - 0.75-1.00 - First syllable stammer, with pause and letter. In...I-Indication
		if (!modified && prearousalmathroll < prearousalcumulative && !nosyllable) {
			stuttered = true;
			modified = true;
			let gasptexts = ["*gasp*", "*pant*", "*shudder*", "*shiver*"];
			let chosengasptext = `${gasptexts[Math.floor(Math.random() * gasptexts.length)]}`;
			modifiedpart = `${modifiedpart}${parttomodify.charAt(0)}...${chosengasptext}-`;
		}

		// Add the full word part now
		modifiedpart = `${modifiedpart}${parttomodify}`;
		let postarousalchoicethresh = Math.min((intensity / (40 * overcorrected) / 3) * usermod * (modified ? 0.5 : 1.0), 0.25);
		let postarousalmathroll = Math.random();
		let postarousalcumulative = 0 + postarousalchoicethresh;
		let postmodified = false;

		// Modifier 1 - 0.00-0.33 - Post text stutter using the syllables library. Indication-tion
		if (!postmodified && postarousalmathroll < postarousalcumulative && !nosyllable) {
			stuttered = true;
			postmodified = true;
			modifiedpart = `${modifiedpart}-${stuttertextsyllables[stuttertextsyllables.length - 1]}`;
			if (Math.random() < postarousalcumulative) {
				modifiedpart = `${modifiedpart}-${stuttertextsyllables[stuttertextsyllables.length - 1]}`;
			}
		}
		postarousalcumulative = postarousalcumulative + postarousalchoicethresh;
		// Modifier 2 - 0.33-0.66 - Post text stutter with delayed syllable. Indication...tion
		if (!postmodified && postarousalmathroll < postarousalcumulative && !nosyllable) {
			stuttered = true;
			postmodified = true;
			modifiedpart = `${modifiedpart}...${stuttertextsyllables[stuttertextsyllables.length - 1]}`;
		}

		// Modifier 3 - 0.66-1.00 - Insert an arousal text, with chance scaled based on user option. Indication mmf~
		if (!postmodified && postarousalmathroll < postarousalcumulative) {
			stuttered = true;
			postmodified = true;
			let arousedtext = arousedtexts[Math.floor(Math.random() * arousedtexts.length)] ?? "mmf\\~";
			modifiedpart = `${modifiedpart} ${arousedtext}`;
		}

		// Finally, if its eating formatting for whatever stupid reason, don't.
		let formattingeaten = [`-#`, `#`];
		if (formattingeaten.includes(newtextparts[i])) {
			outtext = `${outtext} ${newtextparts[i]}`;
		} else {
			outtext = `${outtext} ${modifiedpart}`;
		}
	}

	return { text: outtext.slice(1), stuttered: stuttered }; // Remove starting space;
}

function updateArousalValues() {
	try {
		const now = Date.now();
		const time = now * (getBotOption("bot-timetickrate") / 60000);
		// for users in vibe or chastity, make sure they have a value in arousal
		for (const user in process.vibe) if (!process.arousal[user]) process.arousal[user] = { arousal: 0, prev: 0, timestamp: now };
		for (const user in process.chastity) if (!process.arousal[user]) process.arousal[user] = { arousal: 0, prev: 0, timestamp: now };
		for (const user in process.arousal) {
			const arousal = process.arousal[user];
			// if the timestamp is in the future the user is cooling off from an orgasm or similar and should be skipped
			if (arousal.timestamp > now) continue;
			const traits = getCombinedTraits(user);
			const vibes = getToys(user);
			// if no vibe effect, growth coefficient will be 0
			// otherwise add the effects of the vibes and multiply it with the growth coefficient from belt and bra, and scale it so it ends up in a good range
            let vibegains = vibes.reduce((prev, currVibe) => { 
                let vibedata = { intensity: currVibe.intensity, userID: user }
                return prev + process.toytypes[currVibe.type].calcVibeEffect(vibedata) 
            }, 0)
            // Calculate any arousal gain purely from the chastity devices worn. Add to vibearousal change. 
            let chastityvibegains = traits.calcVibeEffect({ userID: user });
            let growthmult = vibes ? (traits.growthCoefficient ?? 1) : 0
            // I want to pull away from using VIBE_SCALING here, may need to change this later. 
            let minvibegain = traits.minVibe ? (traits.minVibe * VIBE_SCALING) : -9999
            let maxvibegain = traits.maxVibe ? (traits.maxVibe * VIBE_SCALING) : 9999
			let vibearousalchange = growthmult * bounded(minvibegain, vibegains + chastityvibegains, maxvibegain);
            // If the wearer is wearing Gasmask aphrodisiac, amplify the gain by 2x.
            if (getHeadwear(user).includes("gasmask_hornygas")) { vibearousalchange = vibearousalchange * 2 }
			const next = calcNextArousal(traits, time, arousal.arousal, arousal.prev, vibearousalchange, traits.decayCoefficient * UNBELTED_DECAY);
			// set the values to the new ones
			arousal.timestamp = now;
			arousal.prev = arousal.arousal;
			// mathematically it would never reach 0 so reset it to 0 if low enough here
			arousal.arousal = next < RESET_LIMIT ? 0 : next;
			traits.afterArousalChange({ userID: user, prevArousal: arousal.prev, currArousal: arousal.arousal });
		}
		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		process.readytosave.arousal = true;
	} catch (err) {
		console.log(err);
	}
}

function updateSharedBreath() {
    try {
        processed = [];
        let arousalscale = (getBotOption("bot-timetickrate") / 60000) * 0.4
        let minadjustment = 0.1 * (getBotOption("bot-timetickrate") / 60000)
        for (const user in process.headwear) {
            if (process.headwear && process.headwear[user] && process.headwear[user].sharedbreathhose && !processed.includes(process.headwear[user].sharedbreathhose) && !processed.includes(user)) {
                //console.log(`Adjusting horniness for ${user} to ${process.headwear[user].sharedbreathhose}`)
                // If both people are wearing the linked gasmask AND have each other designated to share breath...
                if (getHeadwear(user).includes("gasmasklinked") && getHeadwear(process.headwear[user].sharedbreathhose).includes("gasmasklinked") && 
                    (user == process.headwear[process.headwear[user].sharedbreathhose].sharedbreathhose)) {
                    let personA = getArousal(user)
                    let personB = getArousal(process.headwear[user].sharedbreathhose)
                    let diff = personA - personB;
                    let delta = Math.max(arousalscale * Math.abs(diff), minadjustment);
                    if (diff < 0) {
                        // Person B is hornier, so person A should gain, person B should lose. 
                        addArousal(user, delta);
                        addArousal(process.headwear[user].sharedbreathhose, -delta)
                        console.log(`${process.headwear[user].sharedbreathhose} sharing ${delta} arousal to ${user}`)
                    }
                    else {
                        // Person A is hornier, so person B should gain, person A should lose. 
                        addArousal(process.headwear[user].sharedbreathhose, delta);
                        addArousal(user, -delta)
                        console.log(`${user} sharing ${delta} arousal to ${process.headwear[user].sharedbreathhose}`)
                    }
                    processed.push(user)
                    processed.push(process.headwear[user].sharedbreathhose)
                }
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

function getVibeEquivalent(user) {
	if (!config.getDynamicArousal(user)) return calcStaticVibeIntensity(user) * 2;

	let intensity = getArousal(user);
	if (intensity >= STUTTER_LIMIT) intensity += calcFrustration(user) / 20;
	return intensity;
}

function getArousalDescription(user) {
	if (!config.getDynamicArousal(user)) return null;

	const arousal = getArousal(user);
	const denialCoefficient = calcDenialCoefficient(user);
	const orgasmLimit = ORGASM_LIMIT * denialCoefficient;
	const orgasmProgress = arousal / orgasmLimit;
	// these numbers are mostly arbitrary
	if (orgasmProgress > 1.4) return "Overstimulated";
	if (orgasmProgress > 0.9) return "On edge";
	if (arousal < RESET_LIMIT) return "Not aroused";
	if (arousal < ORGASM_LIMIT * 0.3) return "A bit aroused";
	if (arousal < ORGASM_LIMIT * 0.8) return "Moderately aroused";
	if (arousal < ORGASM_LIMIT * 1.5) return "Very aroused";
	return "Extremely aroused";
}

function getArousalChangeDescription(user) {
	if (!config.getDynamicArousal(user)) return null;

	const arousal = process.arousal[user];
	if (!arousal) return null;
	const lastChange = (arousal.arousal - arousal.prev) / (getBotOption("bot-timetickrate") / 60000);
	if (Math.abs(lastChange) < 0.01) return null;
	// these numbers are mostly arbitrary
	if (lastChange < -2) return "and cooling off rapidly";
	if (lastChange < 0) return "and cooling off";
	if (lastChange < 2) return "and getting a little turned on";
	if (lastChange < ORGASM_LIMIT * 5) return "and getting very hot";
	return "and rushing to the peaks";
}

function getArousal(user) {
	return process.arousal[user]?.arousal ?? 0;
}

function addArousal(user, change) {
	if (!process.arousal[user]) process.arousal[user] = { arousal: 0, prev: 0, timestamp: Date.now() };
	process.arousal[user].arousal += change;
	getCombinedTraits(user).afterArousalChange({ userID: user, prevArousal: (process.arousal[user].arousal - change), currArousal: process.arousal[user].arousal });
	return process.arousal[user].arousal;
}

function clearArousal(user) {
	process.arousal[user] = { arousal: 0, prev: 0, timestamp: Date.now() };
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.arousal = true;
}

function calcNextArousal(traits, time, arousal, prev, growthCoefficient, decayCoefficient) {
	const tickScale = getBotOption("bot-timetickrate") / 60000;

	// first increase it due to vibe effect
	const growth = tickScale * bounded(traits.minGrowth, traits.timescale * (1 + AROUSAL_PERIOD_AMPLITUDE * Math.cos(traits.timescale * time * AROUSAL_PERIOD_A) * Math.cos(traits.timescale * time * AROUSAL_PERIOD_B)) * growthCoefficient * ((RANDOM_BIAS + Math.random()) / (RANDOM_BIAS + 1)), traits.maxGrowth);
	const noDecay = (arousal ?? 0) + growth;
	// then reduce it based on decay
	const decay = tickScale * bounded(traits.minDecay, traits.timescale * decayCoefficient * Math.max((arousal ?? 0) + prev / 2, 0.1), traits.maxDecay);
    //logConsole(`calcNextArousal: ${growth}, ${noDecay}, ${decay}`, 1);
    logConsole(`calcNextArousal: ${bounded(traits.minArousal, noDecay - decay, traits.maxArousal)}`, 1);
    return bounded(traits.minArousal, noDecay - decay, traits.maxArousal);
}

// user attempts to orgasm, returns if it succeeds
function tryOrgasm(user) {
	// always succeed if user isnt using the system
	if (!config.getDynamicArousal(user)) return true;

	const now = Date.now();
	const arousal = getArousal(user);
	const denialCoefficient = calcDenialCoefficient(user);
	const chastity = getChastity(user);
	const traits = getCombinedTraits(user);
	const orgasmLimit = ORGASM_LIMIT;

	if ((arousal * (RANDOM_BIAS + Math.random())) / (RANDOM_BIAS + 1) >= orgasmLimit * denialCoefficient) {
		setArousalCooldown(user, traits.orgasmCooldown, traits.orgasmArousalLeft);
		if (chastity) {
			chastity.timestamp = (chastity.timestamp + now) / 2;
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.chastity = true;
		}
		traits.onOrgasm({ userID: user, prevArousal: arousal });
		return true;
	}

	// failing to orgasm is frustrating
	const penalties = frustrationPenalties.get(user) ?? [];
	penalties.push({ timestamp: now, value: 10, decay: 1 });
	frustrationPenalties.set(user, penalties);
	traits.onFailedOrgasm({ userID: user, arousal: arousal });

	return false;
}

function setArousalCooldown(user, cooldownModifier = 1, arousalLeft = 0) {
	const now = Date.now();
	process.arousal[user].timestamp = now + ORGASM_COOLDOWN * cooldownModifier;
	const old = process.arousal[user].arousal;
	process.arousal[user].arousal *= arousalLeft;
	getCombinedTraits(user).afterArousalChange({ userID: user, prevArousal: old, currArousal: process.arousal[user].arousal });
}

// modify when more things affect it
function calcStaticVibeIntensity(user) {
	const vibes = getToys(user);
	if (!vibes) return 0;
	return vibes.reduce((prev, currVibe) => {
        let vibedata = { intensity: currVibe.intensity }
        return prev + process.toytypes[currVibe.type].calcVibeEffect(vibedata) 
    }, 0)
}

// modify when more things affect it
function calcDenialCoefficient(user) {
	const heavy = getHeavy(user);
	const chastity = getChastity(user);
	if (chastity) return (heavy ? heavyDenialCoefficient(heavy.typeval) : 0) / 2 + getCombinedTraits(user).denialCoefficient;
	return heavy ? heavyDenialCoefficient(heavy.typeval) : 1;
}

function calcFrustration(user) {
	let frustrationmult = getOption(user, "frustration");
	if (frustrationmult == 0) {
		return 0;
	}
	const chastity = getChastity(user);
	if (!chastity) return 0;
	const now = Date.now();
	const hoursBelted = ((now - chastity.timestamp) / (60 * 60 * 1000)) * frustrationmult;
	let baseFrustration;

	if (hoursBelted <= FRUSTRATION_BREAKPOINT_TIME) {
		// for low time locked, the frustratio grows exponentially
		baseFrustration = Math.pow(FRUSTRATION_COEFFICIENT, hoursBelted);
	} else {
		// for longer time beyond that it grows slower
		const unbounded = MAX_FRUSTRATION * FRUSTRATION_BREAKPOINT + FRUSTRATION_MAX_COEFFICIENT * Math.log10(hoursBelted - FRUSTRATION_BREAKPOINT_TIME + 1);
		// ... until a hard cap
		baseFrustration = Math.min(unbounded, MAX_FRUSTRATION);
	}

	// add frustration from temporary decaying penalties such as from failed orgasms
	let penalties = frustrationPenalties.get(user);
	if (!penalties) return baseFrustration;
	// calculate the current frustration caused and remove ones that reach 0
	penalties = penalties.map((current) => [current, current.value - (current.decay * (now - current.timestamp)) / 60000]).filter(([_, remaining]) => remaining > 0);
	// remove ones at 0 from the saved list
	frustrationPenalties.set(
		user,
		penalties.map(([penalty, _]) => penalty),
	);

	// return the sum of the other penalties plus the base frustration from hours locked
	// also, multiple concurrent penalties make it even more frustrating
	return baseFrustration + Math.pow(PENALTY_MULTIPLIER, penalties.length - 1) * penalties.reduce((acc, [_, remaining]) => acc + remaining, 0);
}

// Provides a text string indicating arousal progress
// Will present the bar as a % of the target orgasm rate
function getArousalBar(userID) {
	const arousal = getArousal(userID);
	const denialCoefficient = calcDenialCoefficient(userID);
	const orgasmLimit = ORGASM_LIMIT;
	const filledbar = "■";
	const unfilled = "□";

	let targetorgasmthresh = orgasmLimit * denialCoefficient;
	let percentagefilled = arousal / targetorgasmthresh;

	// Present this bar as a 20 segment string
	let stringout = ``;
	let currprog = 0.0;
	for (let i = 0; i < 10; i++) {
		currprog += 1 / 10;
		if (currprog < percentagefilled) {
			stringout = `${stringout}${filledbar}`;
		} else {
			stringout = `${stringout}${unfilled}`;
		}
	}

	return { bar: stringout, percentage: Math.round(percentagefilled * 100) };
}

function min(a, b) {
	if (!a && a !== 0) return b;
	if (!b && b !== 0) return a;
	return Math.min(a, b);
}

function max(a, b) {
	if (a && a !== 0) return b;
	if (b && b !== 0) return a;
	return Math.max(a, b);
}

function bounded(min, val, max) {
	const noMin = !min && min !== 0;
	const noMax = !max && max !== 0;
	if (noMin && noMax) return val;
	if (noMin) return Math.min(val, max);
	if (noMax) return Math.max(val, min);
	if (max < min) return (max + min) / 2;
	if (val < min) return min;
	if (val > max) return max;
	return val;
}

exports.getVibeEquivalent = getVibeEquivalent;
exports.getArousalDescription = getArousalDescription;
exports.getArousalChangeDescription = getArousalChangeDescription;
exports.getArousalBar = getArousalBar;
exports.calcDenialCoefficient = calcDenialCoefficient;
exports.calcFrustration = calcFrustration;
exports.getArousal = getArousal;
exports.addArousal = addArousal;
exports.clearArousal = clearArousal;
exports.tryOrgasm = tryOrgasm;
exports.setArousalCooldown = setArousalCooldown;
exports.updateArousalValues = updateArousalValues;
exports.frustrationPenalties = frustrationPenalties;
exports.getCombinedTraits = getCombinedTraits;

exports.assignChastity = assignChastity;
exports.getChastity = getChastity;
exports.removeChastity = removeChastity;
exports.assignVibe = assignVibe;
exports.getVibe = getVibe;
exports.removeVibe = removeVibe;
exports.getArousedTexts = getArousedTexts;
exports.stutterText = stutterText;
exports.getChastityTimelock = getChastityTimelock;

exports.getChastityKeys = getChastityKeys;
exports.getChastityKeyholder = getChastityKeyholder;
exports.transferChastityKey = transferChastityKey;
exports.discardChastityKey = discardChastityKey;
exports.findChastityKey = findChastityKey;

exports.getChastityName = getChastityName;
exports.canAccessChastity = canAccessChastity;

exports.promptCloneChastityKey = promptCloneChastityKey;
exports.promptTransferChastityKey = promptTransferChastityKey;
exports.cloneChastityKey = cloneChastityKey;
exports.revokeChastityKey = revokeChastityKey;
exports.getClonedChastityKey = getClonedChastityKey;
exports.getClonedChastityKeysOwned = getClonedChastityKeysOwned;
exports.getOtherKeysChastity = getOtherKeysChastity;

exports.assignChastityBra = assignChastityBra;
exports.getChastityBra = getChastityBra;
exports.removeChastityBra = removeChastityBra;

exports.getChastityBraKeys = getChastityBraKeys;
exports.getChastityBraKeyholder = getChastityBraKeyholder;
exports.transferChastityBraKey = transferChastityBraKey;
exports.discardChastityBraKey = discardChastityBraKey;
exports.findChastityBraKey = findChastityBraKey;

exports.getChastityBraName = getChastityBraName;
exports.canAccessChastityBra = canAccessChastityBra;

exports.promptCloneChastityBraKey = promptCloneChastityBraKey;
exports.promptTransferChastityBraKey = promptTransferChastityBraKey;
exports.cloneChastityBraKey = cloneChastityBraKey;
exports.revokeChastityBraKey = revokeChastityBraKey;
exports.getClonedChastityBraKey = getClonedChastityBraKey;
exports.getClonedChastityBraKeysOwned = getClonedChastityBraKeysOwned;
exports.getOtherKeysChastityBra = getOtherKeysChastityBra;
exports.getChastityBraTimelock = getChastityBraTimelock;

exports.swapChastity = swapChastity;
exports.swapChastityBra = swapChastityBra

exports.updateSharedBreath = updateSharedBreath;