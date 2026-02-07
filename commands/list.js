const { SlashCommandBuilder, ComponentType, ButtonStyle, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { gagtypes, mittentypes } = require("./../functions/gagfunctions.js");
const { heavytypes } = require("./../functions/heavyfunctions.js");
//const { chastitytypes, chastitybratypes } = require("./../functions/vibefunctions.js");
const { headweartypes } = require("./../functions/headwearfunctions.js");
const { collartypes } = require("./../functions/collarfunctions.js");
const { wearabletypes } = require("./../functions/wearablefunctions.js");
const { ButtonBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { StringSelectMenuOptionBuilder } = require("discord.js");
const { StringSelectMenuBuilder } = require("discord.js");

const PAGE_SIZE = 20;

async function generateList(listchoice, page, details) {
	let fulltext = `## Available **${listchoice.replace("+", " ")}** ${listchoice.replace("+", " ") == "Wearable" ? "Clothing" : "Restraints"}:\n`;
	let maxpages = Math.ceil(process.listtexts[listchoice.replace("+", " ")].length / PAGE_SIZE);
	for (let i = (page - 1) * PAGE_SIZE; i < Math.min(page * PAGE_SIZE, process.listtexts[listchoice.replace("+", " ")].length); i++) {
		fulltext = `${fulltext}\n- **${process.listtexts[listchoice.replace("+", " ")][i].name}**`;
		if (details && process.listtexts[listchoice.replace("+", " ")][i].value.length > 0) {
			let backticked = "`" + process.listtexts[listchoice.replace("+", " ")][i].value + "`";
			fulltext = `${fulltext} - ${backticked}`;
		}
	}
	let textcomponent = new TextDisplayBuilder().setContent(fulltext);
	let buttons = [
		// Page Down
		new ButtonBuilder()
			.setCustomId(`list_pagedown_${listchoice}_${page}_${details}`)
			.setLabel("← Prev Page")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page <= 1),
		// Current Page
		new ButtonBuilder().setCustomId(`list_none_${listchoice}_${page}_${details}`).setLabel(`Page ${page} of ${maxpages}`).setStyle(ButtonStyle.Secondary),
		// Page Up
		new ButtonBuilder()
			.setCustomId(`list_pageup_${listchoice}_${page}_${details}`)
			.setLabel("Next Page →")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page >= maxpages),
	];

	let pagecomponents = [textcomponent, new ActionRowBuilder().addComponents(...buttons)];

	// Construct the menu selector
	let menupageoptions = new StringSelectMenuBuilder().setCustomId(`list_menuselector_${details}`);

	let menupageoptionsarr = [];
	Object.keys(process.listtexts).forEach((k) => {
		let opt = new StringSelectMenuOptionBuilder().setLabel(k).setValue(`list_pageselect_${k.replace(" ", "+")}_${details}`);
		menupageoptionsarr.push(opt);
	});

	menupageoptions.setPlaceholder(`List: ${listchoice.replace("+", " ")}`);
	menupageoptions.addOptions(...menupageoptionsarr);
	pagecomponents.push(new ActionRowBuilder().addComponents(menupageoptions));

	return { components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] };
}

module.exports = {
	data: new SlashCommandBuilder().setName("list").setDescription("Testing List stuff"),
	async execute(interaction) {
		try {
			interaction.reply(await generateList("Heavy", 1, false));
		} catch (err) {
			console.log(err);
		}
	},
	async interactionresponse(interaction) {
		try {
			let optionparts = interaction.customId.split("_");
			// We changed page, new page!
			if (optionparts[1] == "menuselector") {
				interaction.update(await generateList(interaction.values[0].split("_")[2], 1, optionparts[2] == "true" ? true : false));
			} else if (optionparts[1] == "pagedown") {
				interaction.update(await generateList(optionparts[2], parseInt(optionparts[3]) - 1, optionparts[4] == "true" ? true : false));
			} else if (optionparts[1] == "none") {
				interaction.update(await generateList(optionparts[2], parseInt(optionparts[3]), !(optionparts[4] == "true" ? true : false)));
			} else if (optionparts[1] == "pageup") {
				interaction.update(await generateList(optionparts[2], parseInt(optionparts[3]) + 1, optionparts[4] == "true" ? true : false));
			}
		} catch (err) {
			console.log(err);
		}
	},
    async help(userid, page) {
        //let restrictedtext = (getHeavy(userid)) ? `***You are in heavy bondage***\n` : ""
        let overviewtext = `## List
### Usage: /list

Displays all items of a given category that can be applied, such as gags, mittens, chastity devices or others.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
