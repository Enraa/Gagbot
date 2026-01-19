const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getPronouns, setPronouns, pronounsMap } = require('./../functions/pronounfunctions.js')


// Build the choice array
const pronounTypes = []

for(const x of pronounsMap.keys()){
	pronounTypes.push({
		name : x,
		value : x,
	})
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pronouns')
		.setDescription(`Set your pronouns, displayed in bot messages`)
		.addStringOption(opt =>
			opt.setName('pronouns')
			.setDescription('Your pronouns')
            .addChoices(...pronounTypes)
			.setRequired(true)
		),
    async execute(interaction) {
		try {
			interaction.reply({ content: `Your pronouns have been set to "${interaction.options.getString('pronouns')}"`, flags: MessageFlags.Ephemeral })
			setPronouns(interaction.user.id, interaction.options.getString('pronouns'))
		}
		catch (err) {
			console.log(err);
		}
    }
}