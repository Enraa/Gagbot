const { findCollarKey, getBaseCollar } = require("./collarfunctions");
const { findChastityKey, getChastity, getArousal, calcFrustration } = require("./vibefunctions");
const { their } = require("./pronounfunctions");
const { getMitten } = require("./gagfunctions");
const fs = require("fs");
const { getUserVar, setUserVar } = require("./usercontext");
const { getHeavy } = require("./heavyfunctions");
const { config, getOption } = require("./configfunctions");
const { findChastityBraKey } = require("./vibefunctions");
const { messageSendChannel } = require("./messagefunctions.js");
const { PermissionsBitField } = require("discord.js");
const { frustrationPenalties } = require("./vibefunctions.js");
const { getCombinedTraits } = require("./vibefunctions.js");
const { logConsole } = require("./logfunctions.js");
const { getBaseChastity } = require("./chastityfunctions.js");
const { getTextGeneric } = require("./textfunctions.js");
const { getHeadwearRestrictions } = require("./headwearfunctions.js");

const MAX_FUMBLE_CHANCE = 0.95;

// returns how heavy the fumble was (usually 1 = regular, 2 = drop key)
function rollKeyFumble(keyholder, locked) {
	if (process.keyfumbling == undefined) {
		process.keyfumbling = {};
	}
    // Disabled key fumbling, just don't.
    return 0;
    
	// get the initial fumble chance
	let fumbleChance = getFumbleChance(keyholder, locked);

	// just save time and skip this thing if they cannot fumble
	if (fumbleChance <= 0) return 0;
    console.log(fumbleChance)
    
    // Fumbles have AT MOST 95% chance to happen.
    if (Math.random() < Math.min(fumbleChance, MAX_FUMBLE_CHANCE)) {
        // They fumbled, lets work with that.
        // Push the chance they had to fumble to blessings
        if (config.getBlessedLuck(keyholder)) {
            // if they use blessed luck, add the success chance to their saved blessing
            const blessing = getUserVar(keyholder, "blessed") ?? 0;
            setUserVar(keyholder, "blessing", blessing + 1 - fumbleChance);
        }

        // fumbling is frustrating
        const penalties = frustrationPenalties.get(keyholder) ?? [];
        penalties.push({ timestamp: Date.now(), value: 15, decay: 2 });
        frustrationPenalties.set(keyholder, penalties);

        console.log(Math.max(0.05, (Math.min((fumbleChance / 2.5), MAX_FUMBLE_CHANCE))))

        // Reduce further fumble chance to some % of the fumble chance
        // Further fumbles have at LEAST 5% chance to happen and AT MOST 95% chance to happen.
        if (Math.random() < Math.max(0.05, (Math.min((fumbleChance / 2.5), MAX_FUMBLE_CHANCE)))) {
            // CASCADE OF FAILURES
            // Dropping the key is even more frustrating.
            const penalties = frustrationPenalties.get(keyholder) ?? [];
            penalties.push({ timestamp: Date.now(), value: 15, decay: 2 });
            frustrationPenalties.set(keyholder, penalties);
            return 2; // They dropped the key.
        }
        else {
            return 1; // They kept their fingers on the key
        }
    }
    else {
        return 0; // They did not drop the key!
    }
}

function getFumbleChance(keyholder, locked) {
	// cannot fumble if disabled
	if (config.getDisabledKeyFumbling(locked)) return 0;
	// ... or if not using the dynamic arousal system
	if (!config.getDynamicArousal(keyholder)) return 0;
	// ... or if it's someone else and either has disable fumbling for others
	if (keyholder != locked && (!config.getKeyFumblingOthers(keyholder) || !config.getKeyFumblingOthers(locked))) return 0;

    // Add frustration if trying to unlock OWN device
    // Idk why frustration is broken apparently, but w/e, can fix later. 
    let frustrationaddition = (locked == keyholder) ? calcFrustration(keyholder) : 0;

    // "simple" math that models a simple quadratic equation
    // Target numbers are 15 arousal = 0, 150 arousal = 100
    // Frustration influences how sharply the curve tilts upwards as well as adding a tiny bit to the start
    // The notable part is that frustration SEVERELY affects higher arousal levels. 
    console.log((((0.0045 + frustrationaddition * 0.0004) * Math.pow(getArousal(locked), 2) - 1) + (frustrationaddition / 100)))
	let chance = Math.max(0, (((0.0045 + frustrationaddition * 0.0004) * Math.pow(getArousal(locked), 2) - 1) + (frustrationaddition / 100)))

	// chance is increased if the keyholder is wearing mittens
	if (getMitten(keyholder)) {
        chance *= 1.1;
		chance += 10;
	}

	// reduce the fumble chance by saved up blessing from prior unlucky rolls
	if (config.getBlessedLuck(keyholder)) chance -= getUserVar(keyholder, "blessed") ?? 0;

	// divine intervention
	if (Math.random() < 0.02) chance -= 50;

	return chance / 100;
}

async function handleKeyFinding(message) {
    let processvars = ["collar", "chastity", "chastitybra"];
    processvars.forEach((pv) => {
        if (process[pv] == undefined) { process[pv] = {}}
        Object.entries(process[pv]).forEach(async (en) => {
            try {
                if (en[1]?.fumbled) {
                    if (Math.random() < (Math.max(Math.min(message.content.length * 0.0005, 0.2), 0.01))) {
                        // Key was found! Lets make sure the sender AND the user can view the channel.
                        // Implicitly, the sender should be able to lol
                        let weareruser = await message.guild.members.fetch(en[0]);
                        if (message.channel.permissionsFor(weareruser).has(PermissionsBitField.Flags.ViewChannel)) {
                            // Wearer IS able to view this channel! Both people should be able to see this channel then.
                            // Determine which string sets to use, starting with other or self.
                            let finderpart = "other";
                            if (weareruser.id == message.member.id) {
                                finderpart = "self";
                            }
                            // Now an append if they're in mittens or heavy bondage
                            let extrafindkeypart = "";
                            let chance = 1.0
                            if (getMitten(message.member.id)) {
                                chance = 0.5;
                                extrafindkeypart = "_mitten"
                            }
                            if (getHeavy(message.member.id)) {
                                chance = 0.0;
                                extrafindkeypart = "_heavy"
                            }
                            // Blind people cannot see.
                            if (!getHeadwearRestrictions(message.member.id).canInspect) {
                                chance = Math.min(chance, 0.25)
                            }
                            let data = {
                                interactionuser: message.member,
                                targetuser: weareruser
                            }
                            if ((pv == "chastity") || (pv == "chastitybra")) {
                                let def = (pv == "chastity") ? "belt" : "bra"
                                data.c1 = getBaseChastity(en[1].chastitytype ?? `${def}_silver`).name
                            }
                            else if (pv == "collar") {
                                data.c1 = getBaseCollar(en[1].collartype ?? `collar_leather`).name
                            }
                            if (Math.random() < chance) {
                                // Successfully found the key!
                                messageSendChannel(getTextGeneric(`find_key_${finderpart}${extrafindkeypart}`, data), message.channel.id)
                                // Destroy cloned keyholders if the keyholder is new!
                                if (message.member.id != process[pv][en[0]].keyholder) {
                                    process[pv][en[0]].clonedKeyholders = [];
                                }
                                // Assign the new keyholder and then delete the fumbled date. 
                                process[pv][en[0]].keyholder = message.member.id;
                                delete process[pv][en[0]].fumbled;
                            }
                            else {
                                // Fumbled finding the key lol
                                messageSendChannel(getTextGeneric(`find_keyfail_${finderpart}${extrafindkeypart}`, data), message.channel.id)
                            }
                        }
                    }
                }
            }
            catch (err) {
                logConsole(`handleKeyFinding: ${err}`, 4);
            }
        })
    })
}

// Discards a key held by keyholderid for userid. Varying effect based on device.
function discardKey(userid, keyholderid, device) {
    // If it isnt one of the three devices we know about, go away
    if ((device != "collar") && (device != "chastity belt") && (device != "chastity bra")) { 
        console.log(`Unknown device ${device}. Use "collar", "chastity belt" or "chastity bra"`)
        return false 
    }
    let processvar = "collar";
    if (device == "chastity belt") { processvar = "chastity" }
    if (device == "chastity bra") { processvar = "chastitybra" }
    // If this is undefined, we have some big problems lol
    let typelocked = "none";
    if (process[processvar] == undefined) { process[processvar] = {} }
    if (process[processvar][userid]) {
        if (process[processvar][userid].keyholder == keyholderid) {
            // Lost primary keys
            process[processvar][userid].fumbled = Date.now(); // We might be able to track time with this?
            typelocked = "keyholder";
        }
        else if (process[processvar][userid].clonedKeyholders.includes(keyholderid)) {
            // Lost a clone. Clones should be destroyed.
            process[processvar][userid].clonedKeyholders.splice(process[processvar][userid].clonedKeyholders.indexOf(keyholderid), 1)
            typelocked = "clone";
        }
    }
    if (process.readytosave == undefined) {
		process.readytosave = {};
	}
    process.readytosave[processvar] = true;
    return typelocked;
}

function getFindFunction(restraint) {
	switch (restraint) {
		case "chastity belt":
			return findChastityKey;
		case "collar":
			return findCollarKey;
		case "chastity bra":
			return findChastityBraKey;
		default:
			console.log(`No find function for restraint ${restraint}`);
			return (_0, _1) => false;
	}
}

async function sendFindMessage(message, lockedUser, restraint) {
	try {
		if (message.author.id == lockedUser) message.channel.send(`${message.author} has found the key to ${their(message.author.id)} ${restraint}!`);
		else message.channel.send(`${message.author} has found the key to <@${lockedUser}>'s ${restraint}!`);
	} catch (err) {
		console.log(err); // Seriously plz dont crash
	}
}

async function sendFindFumbleMessage(message, lockedUser, restraint) {
	try {
		if (message.author.id == lockedUser) message.channel.send(`${message.author} has found the key to ${their(message.author.id)} ${restraint} but fumbles when trying to pick it up!`);
		else message.channel.send(`${message.author} has found the key to <@${lockedUser}>'s ${restraint} but fumbles when trying to pick it up!`);
	} catch (err) {
		console.log(err); // Seriously plz dont crash
	}
}

function calcFindSuccessChance(user) {
	if (getHeavy(user)) return 0;
	if (getMitten(user)) return 0.5;
	else return 1;
}

exports.getFumbleChance = getFumbleChance;
exports.rollKeyFumble = rollKeyFumble;
exports.handleKeyFinding = handleKeyFinding;

exports.discardKey = discardKey;