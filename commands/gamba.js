const { SlashCommandBuilder, TextDisplayBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");
const { gambaDeathrollStart } = require(`./../functions/gamefunctions.js`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("gamba")
		.setDescription("Start a gamba game...")
        .addSubcommand((subc) => 
            subc.setName("deathroll")
                .setDescription("Deathroll someone with reducing numbers")
                .addNumberOption((opt) => 
                    opt.setName("startingvalue")
                       .setDescription("Starting Value? (Optional, defaults to 1000)")
                )
        ),
    async execute(interaction) {
        try {
            let subcommand = interaction.options.getSubcommand();
            if (!subcommand) {
                interaction.reply(`Please update your commands!`)
            }
            else if (subcommand == "deathroll") {
                interaction.reply(await gambaDeathrollStart(interaction));
            }
            else if (subcommand == "interact") {
                interaction.reply(`Lock interactions haven't been implemented yet...`)
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}