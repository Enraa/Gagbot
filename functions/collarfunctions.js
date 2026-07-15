const fs = require("fs");
const path = require("path");
const https = require("https");
const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { getCollarPerm } = require("./getters/collar/getCollarPerm");
const { traceFirstParam } = require("./other/TESTS/traceFirstParam");

/*const collartypes = [
	{ name: "Latex Collar", value: "collar_latex", tags: ["latex"] },
	{ name: "Leather Collar", value: "collar_leather", tags: ["leather"] },
	{ name: "Cyber Doll Collar", value: "collar_cyberdoll" },
	{ name: "Hardlight Collar", value: "collar_hardlight" },
	{ name: "Runic Collar", value: "collar_runic" },
	{ name: "Tall Posture Collar", value: "collar_posture" },
    { name: "Latex Posture Collar", value: "collar_posturelatex", tags: ["latex"] },
    { name: "Latex Neck Corset", value: "collar_neckcorsetlatex", tags: ["latex"] },
	{ name: "Ruffled Maid Collar", value: "collar_maid" },
	{ name: "Nevermere Tracking Collar", value: "collar_nevermere", tags: ["leather"] },
	{ name: "Steel Collar", value: "collar_steel", tags: ["metal"] },
	{ name: "Kitty Collar", value: "collar_kitty" },
	{ name: "Puppy Collar", value: "collar_puppy" },
	{ name: "Inari Collar", value: "collar_inari" },
	{ name: "Livingwood Collar", value: "collar_livingwood", tags: ["living"] },
	{ name: "Sheep Collar", value: "collar_sheep" },
	{ name: "Potion Collar", value: "collar_potion" },
	{ name: "Princess Collar", value: "collar_princess" },
	{ name: "Star-cursed Collar", value: "collar_star" },
	{ name: "Moonveil Collar", value: "collar_moon" },
	{ name: "Starmetal Collar", value: "collar_starmetal", tags: ["metal"] },
    { name: "Maid Training Collar", value: "collar_maidtraining", special: true },
    { name: "Struggle Collar", value: "collar_struggle", special: true },
    { name: "Engraved Collar", value: "collarengraved", special: true },
    { name: "Collar of Headpat Vulnerability", value: "collarheadpatvuln", special: true },
    { name: "Remote-Controlled Shock Collar", value: "remoteshockcollar", special: true },
    { name: "Horny Shock Collar", value: "hornyshockcollar", special: true },
    { name: "Sponsorship Collar", value: "sponsorcollar", special: true },
    { name: "Handcuff Amulet", value: "handcuffamulet" },
    { name: "Collar Bell", value: "collarbell", special: true, specialonly: true },
    { name: "Dampened Collar Bell", value: "collarbell_dampened", special: true, specialonly: true },
    { name: "Orgasm Control Module", value: "collar_orgasmcontrol", special: true, specialonly: true, tags: ["autonomy"] },
];*/

function loadCollarTypes() {
    // Grab all the command files from the commands directory
    let collarautocompletes = [];
    let collartypes = {};
    const commandsPath = path.join(__dirname, "..", "collar");
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

    // Push the gag name over to the choice array.
    for (const file of commandFiles) {
        const collar = require(`${commandsPath}/${file}`);
        collartypes[file.replace(".js", "")] = collar;
        collartypes[file.replace(".js", "")].value = file.replace(".js", "") // Compatibility with old .value code
        if (!collar.hidden) { collarautocompletes.push({ name: collar.name, value: file.replace(".js", "") }) };
    }
    if (process.autocompletes == undefined) { process.autocompletes = {} }

    process.autocompletes.collar = collarautocompletes;
    process.collartypes = collartypes;
}

// Called to prompt the wearer if it is okay to clone a key.
async function promptCloneCollarKey(serverID, user, target, clonekeyholder) {
    traceFirstParam(arguments[0]);
	return new Promise(async (res, rej) => {
        try {
            let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
            let bondageaccess = `${getCollarPerm(serverID, target.id, "mitten") ? "mitten you, " : ""}${getCollarPerm(serverID, target.id, "chastity") ? "put you in chastity, " : ""}${getCollarPerm(serverID, target.id, "chastity") ? "put heavy bondage on you, " : ""}${getCollarPerm(serverID, target.id, "mask") ? "put headgear on you, " : ""}`.slice(0, -2);
            let dmchannel = await target.createDM();
            await dmchannel.send({ content: `${user} would like to give ${clonekeyholder} a copy of your collar key. Do you want to allow this?${bondageaccess.length > 0 ? `\n\n**Note: ${clonekeyholder} will have access to ${bondageaccess}.**` : ""}`, components: [new ActionRowBuilder().addComponents(...buttons)] }).then((mess) => {
                // Create a collector for up to 5 minutes
                const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

                collector.on("collect", async (i) => {
                    console.log(i);
                    if (i.customId == "acceptButton") {
                        await mess.delete().then(() => {
                            i.reply(`Confirmed - ${clonekeyholder} will receive a copied key for your collar!`);
                        });
                        res(true);
                    } else {
                        await mess.delete().then(() => {
                            i.reply(`Rejected - ${clonekeyholder} will NOT receive a copied key for your collar!`);
                        });
                        rej(true);
                    }
                });

                collector.on("end", async (collected) => {
                    // timed out
                    if (collected.length == 0) {
                        await mess.delete().then(() => {
                            i.reply(`Timed Out - ${clonekeyholder} will NOT receive a copied key for your collar!`);
                        });
                        rej(true);
                    }
                });
            });
        }
		catch (err) {
            console.log(err);
        }
	});
}

// Called to prompt the wearer if it is okay to give a key.
async function promptTransferCollarKey(serverID, user, target, newKeyholder) {
    traceFirstParam(arguments[0]);
	return new Promise(async (res, rej) => {
		try {
			let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
			let bondageaccess = `${getCollarPerm(serverID, target.id, "mitten") ? "mitten you, " : ""}${getCollarPerm(serverID, target.id, "chastity") ? "put you in chastity, " : ""}${getCollarPerm(serverID, target.id, "chastity") ? "put heavy bondage on you, " : ""}${getCollarPerm(serverID, target.id, "mask") ? "put headgear on you, " : ""}`.slice(0, -2);
			let dmchannel = await target.createDM();
			await dmchannel.send({ content: `${user} would like to give ${newKeyholder} your collar key. Do you want to allow this?${bondageaccess.length > 0 ? `\n\n**Note: ${newKeyholder} will have access to ${bondageaccess}.**` : ""}`, components: [new ActionRowBuilder().addComponents(...buttons)] }).then((mess) => {
				// Create a collector for up to 5 minutes
				const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

				collector.on("collect", async (i) => {
					console.log(i);
					if (i.customId == "acceptButton") {
						await mess.delete().then(() => {
							i.reply(`Confirmed - ${newKeyholder} will receive the key for your collar!`);
						});
						res(true);
					} else {
						await mess.delete().then(() => {
							i.reply(`Rejected - ${newKeyholder} will NOT receive the key for your collar!`);
						});
						rej(true);
					}
				});

				collector.on("end", async (collected) => {
					// timed out
					if (collected.length == 0) {
						await mess.delete().then(() => {
							i.reply(`Timed Out - ${newKeyholder} will NOT receive the key for your collar!`);
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

exports.promptCloneCollarKey = promptCloneCollarKey;
exports.promptTransferCollarKey = promptTransferCollarKey;

exports.loadCollarTypes = loadCollarTypes;