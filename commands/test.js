const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { mittentypes } = require('./../functions/gagfunctions.js')
const { heavytypes } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent, timelockChastityModalnew } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
        .setDescription(`Put heavy bondage on, preventing the use of any command`)
		.addUserOption((opt) => opt.setName("wearer").setDescription("Who wears the belt?").setRequired(false))
        .addUserOption((opt) => opt.setName("keyholder").setDescription("If selflocked, who is your temporary keyholder?").setRequired(false)),
    async execute(interaction) {
		try {
			if (interaction.user.id != "125093095405518850") {
                await interaction.reply("You're not Enraa. No. <:NijikaGrin:1051258841913905302>")
                return
            }

    		const wearer = interaction.options.getUser("wearer") ?? interaction.user;
    		const tempKeyholder = interaction.options.getUser("keyholder");
			
			interaction.showModal(await timelockChastityModalnew(interaction, wearer, tempKeyholder));
		}
		catch (err) {
			console.log(err)
		}
    }
}