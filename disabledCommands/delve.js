const { SlashCommandBuilder } = require("discord.js");
const { handleDelveInteraction, handleDelveSlashCommand } = require("../functions/delvefunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("delve")
		.setDescription(`ALPHA - Only available to Enraa`)
        .addSubcommand((subcommand) => 
            subcommand
                .setName("run")
                .setDescription("Display your current Delve run")
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("inventory")
                .setDescription("View your Delve Inventory")
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("stats")
                .setDescription("View your Delve Stats")
        ),
	async execute(interaction) {
		try {
            if (interaction.user.id != process.client.application.owner.id) {
                interaction.reply(`You're not <@${process.client.application.owner.id}>. This command is currently in development and is not available for others to run.`)
                return;
            }
            await handleDelveSlashCommand(interaction);     
		} catch (err) {
			console.log(err);
		}
	},
    async interactionresponse(interaction) {
        try {
            await handleDelveInteraction(interaction)
        }
        catch (err) {
            console.log(err)
        }
    }
};
