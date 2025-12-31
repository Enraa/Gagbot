const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { generateConfigModal, configoptions, getOption, setOption } = require('./../functions/configfunctions.js');
const { getHeadwear, getHeadwearName, getLockedHeadgear, addLockedHeadgear, removeLockedHeadgear } = require('./../functions/headwearfunctions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('item')
        .setDescription(`Prevent a worn item from being removed...`)
		.addSubcommand((subcommand) =>
      		subcommand
				.setName("lock")
				.setDescription("Lock an item...")
				.addStringOption((opt) => 
					opt.setName("wornitem")
						.setDescription("Which worn item to lock?")
						.setAutocomplete(true)
						.setRequired(true)
					)
		)
		.addSubcommand((subcommand) =>
      		subcommand
				.setName("unlock")
				.setDescription("Unlock an item...")
				.addStringOption((opt) => 
					opt.setName("wornitem")
						.setDescription("Which locked item to unlock?")
						.setAutocomplete(true)
						.setRequired(true)
					)
    ),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
		let subcommand = interaction.options.getSubcommand();
		try {
			if (subcommand == "lock") {
				let itemsworn = getHeadwear(interaction.user.id)
				let itemslocked = getLockedHeadgear(interaction.user.id)

				let sorted = itemsworn.filter(f => !itemslocked.includes(f))

				/*console.log(itemsworn)
				console.log(itemslocked)
				console.log(sorted);*/

				sorted = sorted.map((f) => { return { name: getHeadwearName(undefined, f), value: f }})
				if (sorted.length == 0) {
					sorted = [{ name: "Nothing", value: "nothing" }]
				}

				console.log(sorted);

				if (focusedValue.length == 0) { await interaction.respond(sorted.slice(0,10)) }
				else {
					await interaction.respond(sorted.filter((f) => (f.name.toLowerCase()).includes(focusedValue.toLowerCase())).slice(0,10))
				}
			}
			else {
				let itemslocked = getLockedHeadgear(interaction.user.id)

				let sorted = itemslocked.map((f) => { return { name: getHeadwearName(undefined, f), value: f }})
				if (sorted.length == 0) {
					sorted = [{ name: "Nothing", value: "nothing" }]
				}
				await interaction.respond(sorted)
			}
		}
		catch (err) {
			console.log(err);
		}
	},
	async execute(interaction) {
		try {
			let subcommand = interaction.options.getSubcommand();
			let chosenitem = interaction.options.getString("wornitem")

			if (subcommand == "lock") {
				if (chosenitem && chosenitem != "nothing") {
					addLockedHeadgear(interaction.user.id, chosenitem)
					interaction.reply({ content: `Item ${getHeadwearName(undefined, chosenitem)} successfully locked!`, flags: MessageFlags.Ephemeral });
				}
				else if (chosenitem == "nothing") {
					interaction.reply({ content: `You chose nothing to lock.`, flags: MessageFlags.Ephemeral });
				}
				else {
					interaction.reply({ content: `Something went wrong choosing an item.`, flags: MessageFlags.Ephemeral });
				}
			}
			else {
				if (chosenitem && chosenitem != "nothing") {
					removeLockedHeadgear(interaction.user.id, chosenitem)
					interaction.reply({ content: `Item ${getHeadwearName(undefined, chosenitem)} successfully unlocked!`, flags: MessageFlags.Ephemeral });
				}
				else if (chosenitem == "nothing") {
					interaction.reply({ content: `You chose nothing to lock.`, flags: MessageFlags.Ephemeral });
				}
				else {
					interaction.reply({ content: `Something went wrong choosing an item.`, flags: MessageFlags.Ephemeral });
				}
			}
		}
		catch (err) {
			console.log(err)
		}
    }
}