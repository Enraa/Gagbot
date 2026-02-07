const { SlashCommandBuilder, ComponentType, ButtonStyle, MessageFlags } = require("discord.js");
const { generateHelpModal } = require("../functions/interactivefunctions.js");

const PAGE_SIZE = 5;

module.exports = {
	data: new SlashCommandBuilder().setName("help").setDescription("Review what commands do!"),
	async execute(interaction) {
		try {
			interaction.reply(await generateHelpModal(interaction.user.id, "Overview", 0));
		} catch (err) {
			console.log(err);
		}
	},
	async interactionresponse(interaction) {
		try {
			let optionparts = interaction.customId.split("_");
            // We changed page, new page!
            if (optionparts[1] == "SELECTMENU") {
                interaction.update(await generateHelpModal(interaction.user.id, interaction.values[0].split("_")[2], 0));
            }
            else {
                interaction.update(await generateHelpModal(interaction.user.id, optionparts[1], optionparts[2]))
            }
		} catch (err) {
			console.log(err);
		}
	},
};
