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

const chastitytypes = [
	{ name: "Featherlight Belt", value: "belt_featherlight", denialCoefficient: 15, minVibe: 2, minArousal: 1 },
	{ name: "Blacksteel Chastity Belt", value: "belt_blacksteel", denialCoefficient: 7.5 },
	{ name: "Silver Chastity Belt", value: "belt_silver", denialCoefficient: 5 },
	{ name: "Latex Lined Chastity Belt", value: "belt_latexlined", denialCoefficient: 5 },
	{ name: "Ancient Chastity Belt", value: "belt_ancient", denialCoefficient: 15 },
	{ name: "Cyber Doll Belt", value: "belt_cyberdoll", denialCoefficient: 10 },
	{ name: "Tungsten Belt", value: "belt_tungsten", denialCoefficient: 7.5 },
	{ name: "Hardlight Belt", value: "belt_hardlight", denialCoefficient: 10 },
	{ name: "Wolf Panties", value: "belt_wolf", denialCoefficient: 7.5 },
	{ name: "Maid Chastity Belt", value: "belt_maid", denialCoefficient: 10 },
	{ name: "Chastity Belt of Eternal Denial", value: "belt_eternal", denialCoefficient: 2000 },
	{ name: "Queensbelt", value: "belt_queen", denialCoefficient: 10 },
	{ name: "Starmetal Belt", value: "belt_starmetal", denialCoefficient: 7.5 },
];

const chastitybratypes = [
	{ name: "Featherlight Bra", value: "bra_featherlight", denialCoefficient: 6, minVibe: 2, minArousal: 1 },
	{ name: "Blacksteel Chastity Bra", value: "bra_blacksteel", denialCoefficient: 3 },
	{ name: "Silver Chastity Bra", value: "bra_silver", denialCoefficient: 3 },
	{ name: "Latex Lined Chastity Bra", value: "bra_latexlined", denialCoefficient: 3 },
	{ name: "Ancient Chastity Bra", value: "bra_ancient", denialCoefficient: 6 },
	{ name: "Cyber Doll Bra", value: "bra_cyberdoll", denialCoefficient: 4 },
	{ name: "Tungsten Bra", value: "bra_tungsten", denialCoefficient: 3 },
	{ name: "Hardlight Bra", value: "bra_hardlight", denialCoefficient: 4 },
	{ name: "Wolf Bra", value: "bra_wolf", denialCoefficient: 3 },
	{ name: "Maid Chastity Bra", value: "bra_maid", denialCoefficient: 3 },
	{ name: "Queensbra", value: "bra_queen", denialCoefficient: 4 },
	{ name: "Starmetal Bra", value: "bra_starmetal", denialCoefficient: 3 },
];

const chastitytypesoptions = chastitytypes.map((chastity) => ({ name: chastity.name, value: chastity.value }));
const chastitybratypesoptions = chastitybratypes.map((chastity) => ({ name: chastity.name, value: chastity.value }));

// the arousal under which it is treated as 0
const RESET_LIMIT = 0.1;
// the minimum arousal required for frustration to also impact speach
const STUTTER_LIMIT = 1;
// the arousal needed for an unbelted user to orgasm
const ORGASM_LIMIT = 10;
// the rate of arousal decay without orgasms when unbelted
const UNBELTED_DECAY = 0.2;
// the maximum frustration that can be reached
const MAX_FRUSTRATION = 1; // Set to 1 to effectively neuter frustration
// by how much arousal randomness is biased upwards
const RANDOM_BIAS = 1;
// by how much vibe intensity is scaled for the arousal model
const VIBE_SCALING = 0.6;
// the rate frustration grows at while belted
const FRUSTRATION_COEFFICIENT = 1.06;
// the portion of maximum frustration where the growth rate reduces
const FRUSTRATION_BREAKPOINT = 0.8;
const FRUSTRATION_BREAKPOINT_TIME = Math.log(FRUSTRATION_BREAKPOINT * MAX_FRUSTRATION) / Math.log(FRUSTRATION_COEFFICIENT);
// the rate frustration reaches the maximum after the breakpoint
const FRUSTRATION_MAX_COEFFICIENT = 7;
// the minimum time between successful orgasms
const ORGASM_COOLDOWN = 60 * 1000;
// the frustration increase caused by failed orgasms
const ORGASM_FRUSTRATION = 5;
const AROUSAL_STEP_SIZE = Number(process.env.AROUSALSTEPSIZE ?? "6000") ?? 6000;
const AROUSAL_STEP_SIZE_SCALING = AROUSAL_STEP_SIZE / 60000;
// how large an impact the arousal variance has
const AROUSAL_PERIOD_AMPLITUDE = 0.3;
// the inverses of the period lengths used for arousal variance. The lengths should be coprime
const AROUSAL_PERIOD_A = 1 / 19;
const AROUSAL_PERIOD_B = 1 / 33;

const assignChastity = (user, keyholder, namedchastity) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	process.chastity[user] = { keyholder: keyholder ? keyholder : "unlocked", timestamp: Date.now(), extraFrustration: 0, chastitytype: namedchastity };
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;
};

const getChastity = (user) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	return process.chastity[user];
};

const removeChastity = (user) => {
	if (process.chastity == undefined) {
		process.chastity = {};
	}
	delete process.chastity[user];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastity = true;
};

const assignChastityBra = (user, keyholder, namedchastity) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	process.chastitybra[user] = { keyholder: keyholder ? keyholder : "unlocked", timestamp: Date.now(), extraFrustration: 0, chastitytype: namedchastity };
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastitybra = true;
};

const getChastityBra = (user) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	return process.chastitybra[user];
};

const removeChastityBra = (user) => {
	if (process.chastitybra == undefined) {
		process.chastitybra = {};
	}
	delete process.chastitybra[user];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.chastitybra = true;
};

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
		if (process.chastity[k].keyholder == user) {
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
	for (let i = 0; i < chastitytypes.length; i++) {
		convertchastityarr[chastitytypes[i].value] = chastitytypes[i].name;
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
		if (process.chastitybra[k].keyholder == user) {
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
	for (let i = 0; i < chastitybratypes.length; i++) {
		convertchastityarr[chastitybratypes[i].value] = chastitybratypes[i].name;
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
		if (getChastity(chastityuser)?.access != 2 && getChastity(chastityuser)?.keyholder == keyholder && keyholder != chastityuser) {
			accessval.access = true;
		}
		// Allow unlocks by any keyholder if no timelock.
		if (getChastity(chastityuser)?.access == undefined && getChastity(chastityuser)?.keyholder == keyholder) {
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
		// Keyholder access if access is unset (no timelocks)
		if (getChastity(chastityuser)?.access == undefined && getChastity(chastityuser)?.keyholder == keyholder) {
			accessval.access = true;
		}
		// Keyholder access if timelock is 1 (keyholder only) but only if not self.
		if (getChastity(chastityuser)?.access == 1 && getChastity(chastityuser)?.keyholder == keyholder && chastityuser != keyholder) {
			accessval.access = true;
		}

		return accessval;
	}
	// Others access only when access is set to 0.
	if (getChastity(chastityuser)?.access == 0 && keyholder != chastityuser) {
		accessval.access = true;
		accessval.public = true;
	}
	// Keyholder access if access is unset (no timelocks)
	if (getChastity(chastityuser)?.access == undefined && getChastity(chastityuser)?.keyholder == keyholder) {
		accessval.access = true;
	}
	// Secondary Keyholder access (cloned key), but only if cloning is NOT true and no timelocks
	let clonedkeys = getChastity(chastityuser)?.clonedKeyholders ?? [];
	if (clonedkeys.includes(keyholder) && getChastity(chastityuser)?.access == undefined) {
		accessval.access = true;
	}
	// Keyholder access if timelock is 1 (keyholder only) but only if not self.
	if (getChastity(chastityuser)?.access == 1 && getChastity(chastityuser)?.keyholder == keyholder && chastityuser != keyholder) {
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
		if (getChastityBra(chastityuser)?.access != 2 && getChastityBra(chastityuser)?.keyholder == keyholder && keyholder != chastityuser) {
			accessval.access = true;
		}
		// Allow unlocks by any keyholder if no timelock.
		if (getChastityBra(chastityuser)?.access == undefined && getChastityBra(chastityuser)?.keyholder == keyholder) {
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
		if (getChastityBra(chastityuser)?.access == undefined && getChastityBra(chastityuser)?.keyholder == keyholder) {
			accessval.access = true;
		}
		// Keyholder access if timelock is 1 (keyholder only) but only if not self.
		if (getChastityBra(chastityuser)?.access == 1 && getChastityBra(chastityuser)?.keyholder == keyholder && chastityuser != keyholder) {
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
	if (getChastityBra(chastityuser)?.access == undefined && getChastityBra(chastityuser)?.keyholder == keyholder) {
		accessval.access = true;
	}
	// Secondary Keyholder access (cloned key), but only if cloning is NOT true and no timelocks
	let clonedkeys = getChastityBra(chastityuser)?.clonedKeyholders ?? [];
	if (clonedkeys.includes(keyholder) && getChastityBra(chastityuser)?.access == undefined) {
		accessval.access = true;
	}
	// Keyholder access if timelock is 1 (keyholder only) but only if not self.
	if (getChastityBra(chastityuser)?.access == 1 && getChastityBra(chastityuser)?.keyholder == keyholder && chastityuser != keyholder) {
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
		for (const user in process.vibe) if (!process.arousal[user]) process.arousal[user] = { arousal: 0, prev: 0, timestamp: now };
		for (const user in process.chastity) if (!process.arousal[user]) process.arousal[user] = { arousal: 0, prev: 0, timestamp: now };
		for (const user in process.arousal) {
			const arousal = process.arousal[user];
			if (arousal.timestamp > now) continue;
			const next = calcNextArousal(time, arousal.arousal, arousal.prev, calcGrowthCoefficient(user), calcDecayCoefficient(user));
			arousal.timestamp = now;
			arousal.prev = arousal.arousal;
			arousal.arousal = next < RESET_LIMIT ? 0 : next;
			let minArousal = 0;
			const chastity = getChastity(user);
			const chastitybra = getChastityBra(user);
			if (getChastity(user)) {
				minArousal = chastitytypes.find((c) => c.value == chastity.chastitytype)?.minArousal ?? 0;
			}
			if (getChastityBra(user)) {
				minArousal = minArousal + (chastitybratypes.find((c) => c.value == chastitybra.chastitytype)?.minArousal ?? 0);
			}
			if (arousal.arousal < minArousal) arousal.arousal = minArousal;
		}
		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		process.readytosave.arousal = true;
	} catch (err) {
		console.log(err);
	}
}

function getVibeEquivalent(user) {
	if (!config.getDynamicArousal(user)) return calcStaticVibeIntensity(user) * 2;

	let intensity = getArousal(user);
	if (intensity >= STUTTER_LIMIT) {
		const chastity = getChastity(user);
		if (chastity) {
			const hoursBelted = (Date.now() - chastity.timestamp) / (60 * 60 * 1000);
			intensity += (calcFrustration(hoursBelted) + (chastity.extraFrustration ?? 0)) / 20;
		}
	}
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
	return process.arousal[user].arousal;
}

function clearArousal(user) {
	process.arousal[user] = { arousal: 0, prev: 0, timestamp: Date.now() };
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.arousal = true;
}

function calcNextArousal(time, arousal, prev, growthCoefficient, decayCoefficient) {
	const noDecay = arousal + ((getBotOption("bot-timetickrate") / 60000) * (1 + AROUSAL_PERIOD_AMPLITUDE * Math.cos(time * AROUSAL_PERIOD_A) * Math.cos(time * AROUSAL_PERIOD_B)) * growthCoefficient * (RANDOM_BIAS + Math.random())) / (RANDOM_BIAS + 1);
	const next = noDecay - (getBotOption("bot-timetickrate") / 60000) * decayCoefficient * Math.max(arousal + prev / 2, 0.1);
	return next;
}

// user attempts to orgasm, returns if it succeeds
function tryOrgasm(user) {
	// always succeed if user isnt using the system
	if (!config.getDynamicArousal(user)) return true;

	const now = Date.now();
	const arousal = getArousal(user);
	const denialCoefficient = calcDenialCoefficient(user);
	const orgasmLimit = ORGASM_LIMIT;

	if ((arousal * (RANDOM_BIAS + Math.random())) / (RANDOM_BIAS + 1) >= orgasmLimit * denialCoefficient) {
		setArousalCooldown(user);
		const chastity = getChastity(user);
		if (chastity) {
			chastity.extraFrustration = 0;
			chastity.timestamp = (chastity.timestamp + now) / 2;
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.chastity = true;
		}
		return true;
	}

	// failing to orgasm is frustrating
	const chastity = getChastity(user);
	if (chastity) {
		const extraFrustration = chastity.extraFrustration ?? 0;
		chastity.extraFrustration = extraFrustration + ORGASM_FRUSTRATION;
		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		process.readytosave.chastity = true;
	}

	return false;
}

function setArousalCooldown(user) {
	const now = Date.now();
	process.arousal[user].timestamp = now + ORGASM_COOLDOWN;
	process.arousal[user].arousal = 0;
}

// modify when more things affect it
function calcGrowthCoefficient(user) {
	let vibes = getVibe(user);
	let minVibe = 0;
	const chastity = getChastity(user);
	const chastitybra = getChastityBra(user);
	if (chastity) minVibe = chastitytypes.find((c) => c.value == chastity.chastitytype)?.minVibe ?? 0;
	if (chastitybra) minVibe = minVibe + (chastitybratypes.find((c) => c.value == chastitybra.chastitytype)?.minVibe ?? 0);
	if (!vibes && !minVibe) return 0;
	return Math.max(vibes?.reduce((a, b) => a + b.intensity, 0) ?? 0, minVibe) * VIBE_SCALING;
}

// modify when more things affect it
function calcStaticVibeIntensity(user) {
	const vibes = getVibe(user);
	if (!vibes) return 0;
	return vibes.reduce((a, b) => a + b.intensity, 0) * 0.7;
}

// modify when more things affect it
function calcDecayCoefficient(user) {
	return getChastity(user) ? UNBELTED_DECAY / 5 : UNBELTED_DECAY;
}

// modify when more things affect it
function calcDenialCoefficient(user) {
	const heavy = getHeavy(user);
	const chastity = getChastity(user);
	if (chastity) {
		const denialCoefficient = chastitytypes.find((c) => c.value == chastity.chastitytype)?.denialCoefficient ?? 5;
		return (heavy ? heavyDenialCoefficient(heavy.typeval) : 0) / 2 + denialCoefficient;
	}
	return heavy ? heavyDenialCoefficient(heavy.typeval) : 1;
}

// modify when more things affect it
function calcFrustration(hoursBelted) {
	if (hoursBelted <= FRUSTRATION_BREAKPOINT_TIME) {
		return Math.pow(FRUSTRATION_COEFFICIENT, hoursBelted);
	}

	const unbounded = MAX_FRUSTRATION * FRUSTRATION_BREAKPOINT + FRUSTRATION_MAX_COEFFICIENT * Math.log10(hoursBelted - FRUSTRATION_BREAKPOINT_TIME + 1);

	if (unbounded > MAX_FRUSTRATION) return MAX_FRUSTRATION;
	return unbounded;
}

// Provides a text string indicating arousal progress
// Will present the bar as a % of the target orgasm rate
function getArousalBar(userID) {
    const arousal = getArousal(userID);
	const denialCoefficient = calcDenialCoefficient(userID);
	const orgasmLimit = ORGASM_LIMIT;
    const filledbar = "■"
    const unfilled = "□"

    let targetorgasmthresh = orgasmLimit * denialCoefficient
    let percentagefilled = arousal / targetorgasmthresh;

    // Present this bar as a 20 segment string 
    let stringout = ``;
    let currprog = 0.00;
    for (let i = 0; i < 10; i++) {
        currprog += (1 / 10);
        if (currprog < percentagefilled) {
            stringout = `${stringout}${filledbar}`
        }
        else {
            stringout = `${stringout}${unfilled}`
        }
    }
    
    return { bar: stringout, percentage: Math.round(percentagefilled * 100) }
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

exports.chastitytypes = chastitytypes;
exports.chastitytypesoptions = chastitytypesoptions;
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

exports.chastitybratypes = chastitybratypes;
exports.chastitybratypesoptions = chastitybratypesoptions;
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
