const { calcFrustration } = require("./vibefunctions");
const { their } = require("./pronounfunctions");
const fs = require("fs");
const { messageSendChannel } = require("./messagefunctions.js");
const { PermissionsBitField } = require("discord.js");
const { frustrationPenalties } = require("./vibefunctions.js");
const { logConsole } = require("./logfunctions.js");
const { getBotOption } = require("./getters/config/getBotOption");
const { getOption } = require("./getters/config/getOption");
const { getUserVar } = require("./getters/config/getUserVar");
const { setUserVar } = require("./setters/config/setUserVar");
const { getArousal } = require("./getters/arousal/getArousal");
const { getMitten } = require("./getters/mitten/getMitten");
const { getHeavy } = require("./getters/heavy/getHeavy");
const { getHeadwearRestrictions } = require("./getters/headwear/getHeadwearRestrictions");
const { getBaseChastity } = require("./getters/chastity/getBaseChastity");
const { getBaseCollar } = require("./getters/collar/getBaseCollar");
const { statsAddCounter } = require("./setters/config/statsAddCounter");
const { getTextGeneric } = require("./textfunctions");
const { markForSave } = require("./other/markForSave");

const MAX_FUMBLE_CHANCE = 0.95;

// returns how heavy the fumble was (usually 1 = regular, 2 = drop key)
function rollKeyFumble(keyholder, locked) {
	if (process.keyfumbling == undefined) {
		process.keyfumbling = {};
	}
    if (getBotOption("bot-allowfumbles") == "Disabled") {
        // Disabled key fumbling, just don't.
        return 0;
    }
    
	// get the initial fumble chance
	let fumbleChance = getFumbleChance(keyholder, locked);

    if (process.forcefumble) { 
        process.forcefumble = false;
        return 2 
    };

	// just save time and skip this thing if they cannot fumble
	if (fumbleChance <= 0) return 0;
    console.log(fumbleChance)
    
    // Fumbles have AT MOST 95% chance to happen.
    if (Math.random() < Math.min(fumbleChance, MAX_FUMBLE_CHANCE)) {
        // They fumbled, lets work with that.
        // Push the chance they had to fumble to blessings
        if (getOption(keyholder, "blessed-luck") == "enabled") {
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

            markForSave("collar");
            markForSave("chastity");
            markForSave("chastitybra");

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
	if (getOption(locked, "fumbling") == "disabled") return 0;
	// ... or if not using the dynamic arousal system
	if (getOption(locked, "arousalsystem") != 2) return 0;
	// ... or if it's someone else and either has disable fumbling for others
	if ((keyholder != locked) && ((getOption(keyholder, "fumbling") != "everyone") || (getOption(locked, "fumbling") != "everyone"))) return 0;

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
	if (getOption(keyholder, "blessed-luck") == "enabled") chance -= getUserVar(keyholder, "blessed") ?? 0;

	// divine intervention
	if (Math.random() < 0.02) chance -= 50;

	return chance / 100;
}

async function handleKeyFinding(message) {
    // The new method will only permit finding keys which the original owner currently owns.
    // That is, you MUST be the primary keyholder for the fumbled key. 
    let processvars = ["collar", "chastity", "chastitybra"];
    processvars.forEach((pv) => {
        if (process[pv] == undefined) { process[pv] = {} }
        Object.entries(process[pv]).forEach(async (en) => {
            try {
                if (en[1]?.fumbled && !en[1]?.temporarykeyholder) {
                    if (Math.random() < (Math.max(Math.min(message.content.length * 0.0005, 0.3), process.forcefindkey ? 1.0 : 0.01))) {
                        if (process.recentmessages[en[0]] != message.channel.id) { 
                            // Even if we succeeded the roll, just leave. The wearer needs to be present for their key to be found
                            // This implicitly protects against finding the key on another server or on threads the wearer isnt in.
                            return 
                        }
                        process.forcefindkey = false;
                        let weareruser = await message.guild.members.fetch(en[0]);
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
                        // Now, we're gonna check if we were allowed to find it in the first place.
                        // Case 1: We own the keys, this is the conventional unfumble approach. 
                        // Simply remove the fumbled flag. 
                        if ((en[1].keyholder == message.member.id)) {
                            if (Math.random() < chance) {
                                // Successfully found the key!
                                messageSendChannel(getTextGeneric(`find_key_${finderpart}${extrafindkeypart}`, data), message.channel.id)
                                // Delete the Fumbled date.
                                delete process[pv][en[0]].fumbled;

                                statsAddCounter(message.member.id, "fumbledkeysrecovered")
                                markForSave("collar");
                                markForSave("chastity");
                                markForSave("chastitybra");
                            }
                            else {
                                // Fumbled finding the key lol
                                messageSendChannel(getTextGeneric(`find_keyfail_${finderpart}${extrafindkeypart}`, data), message.channel.id)
                                statsAddCounter(message.member.id, "fumbledkeysfailedtorecover")
                            }
                        }   
                        // Case 2: We spot our own key... we wont be able to do anything about it though, our keyholder needs to find the key!
                        // This inherently prevents potentially finding own keys to escape, but if thats really needed we can just bump this down the list probably.
                        else if (en[0] == message.member.id) {
                            data.targetuser = await message.guild.members.fetch(en[1].keyholder) // Use the keyholder object to bring that into scope
                            // @___ spots the key to her chastity belt! She tries to point it out to @___ but they're unable to find it...
                            messageSendChannel(getTextGeneric(`spot_key_self`, data), message.channel.id)
                            statsAddCounter(message.member.id, "fumbledkeysfailedtorecover")
                        }
                        // Case 3: We can find keys but the person whose restraint it is does NOT want us to find their key
                        // Simply send a message hinting at a sparkle. 
                        else if ((getOption(message.member.id, "findkeymode") == "others") && (getOption(en[0], "ownrestraintfindkeymode") == "onlykh")) {
                            // @___ *thinks* she sees a little glimmer that looks like @___'s chastity belt key, but the moment she blinks, it disappears again...
                            messageSendChannel(getTextGeneric(`spot_key_other`, data), message.channel.id)
                            statsAddCounter(message.member.id, "fumbledkeysfailedtorecover")
                        }
                        // Case 4: We can find keys and the person whose restraint it is DOES want us to find their key.
                        // This will result in giving us keyholder using the .temporarykeyholder prop and .temporarykeyholdertime. This MUST be set and checked every bot tick to clear.
                        else if ((getOption(message.member.id, "findkeymode") == "others") && (getOption(en[0], "ownrestraintfindkeymode") != "onlykh")) {
                            if (Math.random() < chance) {
                                // Successfully found the key!
                                if (getOption(en[0], "ownrestraintfindkeymode") == 0) {
                                    messageSendChannel(getTextGeneric(`find_key_otherimmediately${extrafindkeypart}`, data), message.channel.id)
                                    delete process[pv][en[0]].fumbled;
                                }
                                else {
                                    messageSendChannel(getTextGeneric(`find_key_${finderpart}${extrafindkeypart}`, data), message.channel.id)
                                    // Set temporary keyholder!
                                    process[pv][en[0]].temporarykeyholder = message.member.id;
                                    process[pv][en[0]].temporarykeyholdertime = (Date.now() + getOption(en[0], "ownrestraintfindkeymode"))
                                }
                                statsAddCounter(message.member.id, "fumbledkeysrecovered")
                                markForSave("collar");
                                markForSave("chastity");
                                markForSave("chastitybra");
                            }
                            else {
                                // Fumbled finding the key lol
                                messageSendChannel(getTextGeneric(`find_keyfail_${finderpart}${extrafindkeypart}`, data), message.channel.id)
                            }
                        }
                    }
                    else {
                        console.log("Failed roll")
                    }
                }
            }
            catch (err) {
                console.log(err)
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
    statsAddCounter(keyholderid, "fumbledkeys")
    statsAddCounter(userid, "restraintkeysfumbled")
    let processvar = "collar";
    if (device == "chastity belt") { processvar = "chastity" }
    if (device == "chastity bra") { processvar = "chastitybra" }
    // If this is undefined, we have some big problems lol
    let typelocked = "none";
    if (process[processvar] == undefined) { process[processvar] = {} }
    if (process[processvar][userid]) {
        if (process[processvar][userid].keyholder == keyholderid) {
            // Lost primary keys
            process[processvar][userid].fumbled = Date.now();
            typelocked = "keyholder";
        }
        else if (process[processvar][userid].clonedKeyholders.includes(keyholderid)) {
            // Lost a clone. Clones should be destroyed.
            process[processvar][userid].clonedKeyholders.splice(process[processvar][userid].clonedKeyholders.indexOf(keyholderid), 1)
            typelocked = "clone";
        }
    }
    markForSave(processvar)
    return typelocked;
}

exports.getFumbleChance = getFumbleChance;
exports.rollKeyFumble = rollKeyFumble;
exports.handleKeyFinding = handleKeyFinding;

exports.discardKey = discardKey;