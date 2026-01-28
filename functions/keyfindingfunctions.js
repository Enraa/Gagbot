const { findCollarKey } = require("./collarfunctions");
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

const MAX_FUMBLE_CHANCE = 0.95;
const FUMBLE_AROUSAL_POTENCY = 11.7;
const FUMBLE_AROUSAL_COEFFICIENT = 0.38;

// returns how heavy the fumble was (usually 1 = regular, 2 = drop key)
function rollKeyFumble(keyholder, locked, maxFumbles = 1) {
	if (process.keyfumbling == undefined) {
		process.keyfumbling = {};
	}
	// get the initial fumble chance
	let fumbleChance = getFumbleChance(keyholder, locked);
	// just save time and skip this thing if they cannot fumble
	if (!fumbleChance) return 0;
	let i;
	// roll until they succeed or the maximum fumbles
	for (i = 0; i < maxFumbles; i++) {
		// the overcap for the current fumble chance is used for the next fumble, with a minimum of a 5% chance for all but the first roll
		const nextFumbleChance = Math.max(0.05, fumbleChance - MAX_FUMBLE_CHANCE);
		// if overcapped, reduce to the cap
		if (fumbleChance > MAX_FUMBLE_CHANCE) fumbleChance = MAX_FUMBLE_CHANCE;
		if (Math.random() < fumbleChance) {
			// user fumbled
			if (config.getBlessedLuck(keyholder)) {
				// if they use blessed luck, add the success chance to their saved blessing
				const blessing = getUserVar(keyholder, "blessed") ?? 0;
				setUserVar(keyholder, "blessing", blessing + 1 - fumbleChance);
			}

			// set the fumble chance for next roll
			fumbleChance = nextFumbleChance;

			// fumbling is frustrating
			const penalties = frustrationPenalties.get(keyholder) ?? [];
			penalties.push({ timestamp: Date.now(), value: 15, decay: 2 });
			frustrationPenalties.set(keyholder, penalties);
		} else {
			// user didn't fumble
			// if it was the first attempt, clear their saved up blessing
			if (i == 0) setUserVar(keyholder, "blessing", 0);
			// return how many fumbles it took before a success
			getCombinedTraits(locked).onFumble({ userID: locked, keyholderID: keyholder, fumbles: i});
			return i;
		}
	}
	// succeeding returns early so if we get here they failed every time
	getCombinedTraits(locked).onFumble({ userID: locked, keyholderID: keyholder, fumbles: maxFumbles});
	return maxFumbles;
}

function getFumbleChance(keyholder, locked) {
	// cannot fumble if disabled
	if (config.getDisabledKeyFumbling(locked)) return 0;
	// ... or if not using the dynamic arousal system
	if (!config.getDynamicArousal(keyholder)) return 0;
	// ... or if it's someone else and either has disable fumbling for others
	if (keyholder != locked && (!config.getKeyFumblingOthers(keyholder) || !config.getKeyFumblingOthers(locked))) return 0;

	// calculate the base chance from arousal (which affects it logarithmically) and frustration (which affects it exponentially until a point)
	let chance = FUMBLE_AROUSAL_POTENCY * Math.log(1 + FUMBLE_AROUSAL_COEFFICIENT * getArousal(keyholder)) + calcFrustration(keyholder);

	// chance is increased if the keyholder is wearing mittens
	if (getMitten(keyholder)) {
		chance += 10;
		chance *= 1.1;
	}

	// reduce the fumble chance by saved up blessing from prior unlucky rolls
	if (config.getBlessedLuck(keyholder)) chance -= getUserVar(keyholder, "blessed") ?? 0;

	// divine intervention
	if (Math.random() < 0.02) chance -= 50;

	return chance / 100;
}

async function handleKeyFinding(message) {
	if (process.discardedKeys == undefined) process.discardedKeys = [];
	if (process.discardedKeys.length == 0) return;
	if (Math.random() > (Math.min(message.content.length / 20, 20) * process.discardedKeys.length) / 100) return;
	const idx = Math.floor(Math.random() * process.discardedKeys.length);
	const restraint = process.discardedKeys[idx];
	if (!restraint) return;

	if (Math.random() < calcFindSuccessChance(message.author.id)) {
		// We found the key! Now lets see if the person could find it anyway
		let wearerobjectinguild;
		try {
			wearerobjectinguild = await message.guild.members.fetch(restraint.wearer);
			// This person should be in the guild.
			const findFunction = getFindFunction(restraint.restraint);
			if (findFunction(idx, message.author.id) && wearerobjectinguild && message.channel.permissionsFor(wearerobjectinguild).has(PermissionsBitField.Flags.ViewChannel)) {
				sendFindMessage(message, restraint.wearer, restraint.restraint);
			}
		} catch (err) {
			// member doesn't exist in this channel, don't even bother anymore
			console.log("Failed to obtain user object for " + restraint.wearer);
		}
	} else {
		sendFindFumbleMessage(message, restraint.wearer, restraint.restraint);
	}
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
