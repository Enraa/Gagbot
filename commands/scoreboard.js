const { SlashCommandBuilder, ComponentType, ButtonStyle, MessageFlags, TextDisplayBuilder, AllowedMentionsTypes } = require("discord.js");
const { ButtonBuilder } = require("discord.js");
const { ActionRowBuilder } = require("discord.js");
const { StringSelectMenuOptionBuilder } = require("discord.js");
const { StringSelectMenuBuilder } = require("discord.js");
const { statsGetAllStat } = require("../functions/getters/config/statsGetAllStat");

const PAGE_SIZE = 20;

async function generateList(menuchoice) {
    let menus = [
        { name: "Headpats Given", useroption: "headpatsgiven" },
        { name: "Headpats Received", useroption: "headpatsreceived" },
        { name: "Headpats on Self", useroption: "headpatsself" },
        { name: "Headpat Crits Given", useroption: "headpatcrits" },
        { name: "Headpat Double Crits Given", useroption: "headpatdoublecrits" },
        { name: "Headpat Triple Crits Given", useroption: "headpattriplecrits" },
        { name: "Headpat Crits Received", useroption: "headpatcritsreceived" },
        { name: "Headpat Double Crits Received", useroption: "headpatdoublecritsreceived" },
        { name: "Headpat Triple Crits Received", useroption: "headpattriplecritsreceived" },
        { name: "Shocks Received", useroption: "timesshocked" },
        { name: "Shocks on Self", useroption: "timesshockedself" },
        { name: "Gagged Messages", useroption: "gaggedmessages" },
        { name: "Struggle Messages", useroption: "strugglemessages" },
    ]
    let placements = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"]

	let fulltext = `## Scoreboard - **${menus.find((t) => t.useroption == menuchoice).name}**\n`;
    let stats = statsGetAllStat(menuchoice).sort((a,b) => { return b[1] - a[1]})
    if (stats.length == 0) {
        fulltext = `${fulltext}*No Leaderboard Data*`
    }
    for (let i = 0; (i < 10) && (i < stats.length); i++) {
        fulltext = `${fulltext}**${placements[i]}**: <@${stats[i][0]}> - ${stats[i][1]}\n`
    }
    let total = stats.reduce((prev, curr) => {
        return (prev + curr[1])
    }, 0)
    fulltext = `${fulltext}\n**Total:** ${total}`



	let textcomponent = new TextDisplayBuilder().setContent(fulltext);

	let pagecomponents = [textcomponent];

	// Construct the menu selector
	let menupageoptions = new StringSelectMenuBuilder().setCustomId(`scoreboard_menuselector_menumenu`);

	let menupageoptionsarr = [];
	menus.forEach((k) => {
		let opt = new StringSelectMenuOptionBuilder().setLabel(k.name).setValue(`scoreboard_pageselect_${k.useroption}`);
		menupageoptionsarr.push(opt);
	});

	menupageoptions.setPlaceholder(menus.find((t) => t.useroption == menuchoice).name);
	menupageoptions.addOptions(...menupageoptionsarr);
	pagecomponents.push(new ActionRowBuilder().addComponents(menupageoptions));

	return { components: pagecomponents, flags: [MessageFlags.IsComponentsV2], allowedMentions: { parse: [] } };
}

module.exports = {
	data: new SlashCommandBuilder()
        .setName("scoreboard")
        .setDescription("View the Leaderboard for Stats!"),
	async execute(interaction) {
		try {
			interaction.reply(await generateList("headpatsgiven"))
		} catch (err) {
			console.log(err);
		}
	},
	async interactionresponse(interaction) {
		try {
			let optionparts = interaction.customId.split("_");
			// We changed page, new page!
			if (optionparts[1] == "menuselector") {
				interaction.update(await generateList(interaction.values[0].split("_")[2]));
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
        let overviewtext = `## Scoreboard
### Usage: /scoreboard

Displays a leaderboard for the top people in a select number of stats.`
        let overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
