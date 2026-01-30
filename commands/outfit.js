const { SlashCommandBuilder, ComponentType, ButtonStyle, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { assignOutfit, restoreOutfit, getOutfits, generateOutfitModal, outfitEntryModal, renameOutfit } = require("../functions/outfitfunctions.js");

const PAGE_SIZE = 5;

module.exports = {
	data: new SlashCommandBuilder().setName("outfit").setDescription("Set up or restore outfits"),
	async execute(interaction) {
		try {
			interaction.reply(await generateOutfitModal(interaction.user.id, "restore", 1, "0000000000"));
		} catch (err) {
			console.log(err);
		}
	},
	async interactionresponse(interaction) {
		try {
			let optionparts = interaction.customId.split("_");
			// We changed page, new page!
			if (optionparts[1] == "save" || optionparts[1] == "restore" || optionparts[1] == "rename") {
				if (optionparts[4]) {
					await interaction.update(await generateOutfitModal(interaction.user.id, optionparts[1], optionparts[2], optionparts[4]));
				} else {
					await interaction.update(await generateOutfitModal(interaction.user.id, optionparts[1], optionparts[2], "0000000000"));
				}
			}
			// Changing an option!
			else if (optionparts[1] == "outfitopt") {
				let optionbits = optionparts[4];
				optionbits = `${optionbits.slice(0, optionparts[3])}${optionbits.charAt(optionparts[3]) == 0 ? `1` : `0`}${optionbits.slice(parseInt(optionparts[3]) + 1)}`;
				await interaction.update(await generateOutfitModal(interaction.user.id, "save", optionparts[2], optionbits));
			}
			// Equipping an outfit!
			else if (optionparts[1] == "restoreoutfit") {
				restoreOutfit(interaction.user.id, getOutfits(interaction.user.id)[optionparts[3]]);
				await interaction.update(await generateOutfitModal(interaction.user.id, "restore", optionparts[2], optionparts[4]));
			}
			// Equipping an outfit!
			else if (optionparts[1] == "saveoutfit") {
				assignOutfit(interaction.user.id, parseInt(optionparts[2]) - 1, optionparts[4]);
				await interaction.update(await generateOutfitModal(interaction.user.id, "save", optionparts[2], optionparts[4]));
			}
			// Renaming an outfit!
			else if (optionparts[1] == "renameoutfit") {
				await interaction.showModal(outfitEntryModal(interaction, optionparts[3]));
			}
		} catch (err) {
			console.log(err);
		}
	},
	async modalexecute(interaction) {
		console.log(interaction);
		let choiceinput = interaction.fields.getTextInputValue("choiceinput");
		let optionparts = interaction.customId.split("_");
		renameOutfit(interaction.user.id, parseInt(optionparts[2]), `${choiceinput.slice(0, 50)}`);
		await interaction.reply({ content: `Updated name for Outfit in slot ${parseInt(optionparts[2]) + 1} to **${choiceinput.slice(0, 50)}**`, flags: MessageFlags.Ephemeral });
		if (process.recentinteraction) {
			if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
				await process.recentinteraction[interaction.user.id].interaction.editReply(await generateOutfitModal(interaction.user.id, "rename", Math.ceil(optionparts[2] / 5), "0000000000"));
			}
			delete process.recentinteraction[interaction.user.id];
		}
	},
    async help(userid, page) {
        let overviewtext = `## Outfit
### Usage: /outfit
-# Restrictions vary depending on if you can normally remove saved outfit pieces

Opens the Outfitter menu, which provides options for saving and restoring up to 20 outfits, each with their respective clothing and respective settings on each **Restraint**, including any **Keys** and **Cloned Keys**.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
