const fs = require("fs");
const path = require("path");
const https = require("https");
// Used to identify syllables during vibe garbling
const nlp = require("compromise");
const nlpSpeech = require("compromise-speech");
nlp.extend(nlpSpeech);

const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { logConsole } = require("./logfunctions.js");
const { getOption } = require("./getters/config/getOption.js");
const { getArousal } = require("./getters/arousal/getArousal.js");
const { addArousal } = require("./setters/arousal/addArousal.js");
const { getBotOption } = require("./getters/config/getBotOption.js");
const { getCombinedTraits } = require("./getters/chastity/getCombinedTraits.js");
const { getToys } = require("./getters/toy/getToys.js");
const { getHeadwear } = require("./getters/headwear/getHeadwear.js");
const { getChastity } = require("./getters/chastity/getChastity.js");
const { getHeavy } = require("./getters/heavy/getHeavy.js");
const { heavyDenialCoefficient } = require("./getters/heavy/getHeavyDenialCoefficient.js");
const { convertPronounsText } = require("./other/convertPronounsText.js");

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

// Given a string, randomly provides a stutter and rarely provides an arousal text per word.
// Doll Edit - Uses  characters to prevent triggering doll protocol on stutters.
// Doll Edit - Wraps italics in  so they are not separated by the doll visor.
function stutterText(msg, text, intensity, arousedtexts) {
	let newtextparts = text.split(" ");
	let outtext = "";
	let stuttered = false;
	let usermod = getOption(msg.author.id, "arousaleffectpotency") ?? 1.0;
	let overcorrected = 3;
    let shockable = (process.collar && process.collar[msg.author.id] && ((process.collar[msg.author.id].collartype == "hornyshockcollar") || (process.collar[msg.author.id].additionalcollars && process.collar[msg.author.id].additionalcollars.includes("hornyshockcollar"))))
	let shocked = false;
    let shockchance = (getArousal(msg.author.id) / 100) * 0.25
	// js is a disaster sometimes. And Im a terrible coder.
	if (isNaN(usermod) || usermod > 2.0 || usermod < 0.33) {
		usermod == 1.0;
	}
	for (let i = 0; i < newtextparts.length; i++) {
		let parttomodify = newtextparts[i];
        let doshock = false;
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
            if (shockable && !shocked && (Math.random() < shockchance) && (i > 0)) {
                shocked = true;
            }
            else if (!shocked) {
                outtext = `${outtext} ${modifiedpart}`;
            }
		}
	}
    if (shocked) {
        // This is a circular if we try to use the text array, so this is a workaround. 
        // I made mistakes when I originally set up these ___functions.js files. 
        // 
        // WE CAN USE THE PROPER GETDATA PATH NOW AFTER PROJECT RELINK
        let shocks = [
            `- owk-`,
            `- g-aaa-`,
            `- guh-`,
            `--`,
            `- eep-`,
            `- aa-a-`,
            `- o-- owwwwwww-`,
            `- gll-`,
            `- yeh-`,
            `- grmmmm-`
        ]
        let texts = [];
        shocks.forEach((t) => {
            if (typeof t != "string" && t.required({ interactionuser: msg.member, targetuser: msg.member })) {
                texts.push(t.text)
            }
            else {
                texts.push(t)
            }
        })
        let chosentext = texts[Math.floor(texts.length * Math.random())];
        console.log(texts)
        console.log(chosentext);
        addArousal(msg.author.id, 4.0);
        outtext = `${outtext}${convertPronounsText(chosentext, { interactionuser: msg.member, targetuser: msg.member })}`
    }

	return { text: outtext.slice(1), stuttered: stuttered, shocked: shocked }; // Remove starting space;
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
	if (getOption(user, "arousalsystem") != 2) return true;

	const now = Date.now();
	const arousal = getArousal(user);
	const denialCoefficient = calcDenialCoefficient(user);
	const chastity = getChastity(user);
	const traits = getCombinedTraits(user);
	const orgasmLimit = ORGASM_LIMIT;

	if ((arousal * (RANDOM_BIAS + Math.random())) / (RANDOM_BIAS + 1) >= orgasmLimit * denialCoefficient) {
        // Increment the arousal counter
        // and also register the highest arousal, if it is higher. 
        if (process.userstats == undefined) { process.userstats = {} }
        if (process.userstats[user] == undefined) { process.userstats[user] = {} }

        process.userstats[user].orgasms = (process.userstats[user].orgasms ?? 0) + 1;

        if (process.userstats[user].highestarousal == undefined) { process.userstats[user].highestarousal = 0 }
        process.userstats[user].highestarousal = Math.round(Math.max(process.userstats[user].highestarousal, arousal))

        if (process.userstats[user].highestdenial == undefined) { process.userstats[user].highestdenial = 0 }
        process.userstats[user].highestdenial = Math.round(Math.max(process.userstats[user].highestdenial, orgasmLimit * denialCoefficient));

        if (process.readytosave == undefined) {
            process.readytosave = {};
        }
        process.readytosave.userstats = true;
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
	if (chastity) return (heavy ? heavyDenialCoefficient(heavy.type) : 0) / 2 + getCombinedTraits(user).denialCoefficient;
	return heavy ? heavyDenialCoefficient(heavy.type) : 1;
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

exports.calcDenialCoefficient = calcDenialCoefficient;
exports.calcFrustration = calcFrustration;
exports.tryOrgasm = tryOrgasm;
exports.setArousalCooldown = setArousalCooldown;
exports.updateArousalValues = updateArousalValues;
exports.frustrationPenalties = frustrationPenalties;

exports.stutterText = stutterText;
exports.calcStaticVibeIntensity = calcStaticVibeIntensity;

exports.promptCloneChastityKey = promptCloneChastityKey;
exports.promptTransferChastityKey = promptTransferChastityKey;

exports.promptCloneChastityBraKey = promptCloneChastityBraKey;
exports.promptTransferChastityBraKey = promptTransferChastityBraKey;

exports.updateSharedBreath = updateSharedBreath;