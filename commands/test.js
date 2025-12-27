const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { mittentypes } = require('./../functions/gagfunctions.js')
const { heavytypes } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent, timelockChastityModal } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
        .setDescription(`Put heavy bondage on, preventing the use of any command`),
    async execute(interaction) {
		try {
			if (interaction.user.id != "125093095405518850") {
                await interaction.reply("You're not Enraa. No. <:NijikaGrin:1051258841913905302>")
                return
            }
			let lists = ["Heavy", "Mittens", /*"Chastity", "Headwear"*/]
			let listchoice = 0;
			let maxoncurrlist = 0; // max page on current list
			let currpage = 0;

			const pageleft = new ButtonBuilder()
					.setCustomId('page_left')
					.setLabel('Prev Page')
					.setStyle(ButtonStyle.Success);

			let listtype = new ButtonBuilder()
				.setCustomId('listchoice')
				.setLabel("Heavy")
				.setStyle(ButtonStyle.Secondary);

			const pageright = new ButtonBuilder()
					.setCustomId('page_right')
					.setLabel('Next Page')
					.setStyle(ButtonStyle.Success);

			const row = new ActionRowBuilder().addComponents(pageleft, listtype, pageright);

			let getItemsText = (list, page) => {
				let allitems = [];
				if (list == "Heavy") {
					allitems = heavytypes.map(f => f.name)
				}
				else if (list == "Mittens") {
					allitems = mittentypes.map(f => f.name)
				}
				// insert the other lists eventually
				let itemoffset = page * 15;
				if (itemoffset >= allitems.length) { 
					itemoffset = 0;
					page = 0;
				}
				maxoncurrlist = Math.floor(allitems.length / 15);
				let chosenitems = allitems.slice(itemoffset, itemoffset + 15)
				let outtext = `## All ${list} Restraints - (Page ${page+1} of ${maxoncurrlist})`
				chosenitems.forEach((i) => {
					outtext = `${outtext}${i}\n`
				})

				return outtext
			}

			const response = await interaction.reply({
				content: getItemsText(lists[listchoice], currpage),
				components: [row],
				withResponse: true,
			});

			const collectorFilter = (i) => i.user.id === interaction.user.id;
			try {
				const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 120_000 });

				if (confirmation.customId === 'page_left') {
					currpage = Math.min(0, currpage - 1);

					await confirmation.update({ content: getItemsText(lists[listchoice], currpage), components: [row] });
				} 
				else if (confirmation.customId === 'page_right') {
					currpage = Math.max(maxoncurrlist, currpage + 1);

					await confirmation.update({ content: getItemsText(lists[listchoice], currpage), components: [row] });
				}
				else if (confirmation.customId === 'listchoice') {
					listchoice++;
					if (listchoice >= lists.length) { listchoice = 0 } // reset to 0 when running out of choices!
					listtype.setLabel(lists[listchoice])

					await confirmation.update({ content: getItemsText(lists[listchoice], currpage), components: [row] });
				}
			} catch (err) {
				console.log(err);
				//await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
			}
		}
		catch (err) {
			console.log(err)
		}
    }
}