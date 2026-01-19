const { SlashCommandBuilder, ComponentType, ButtonStyle, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { getMitten, deleteMitten } = require('./../functions/gagfunctions.js')
const { getHeavy, commandsheavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent, timelockChastityModal } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('debug')
        .setDescription(`Enraa Only - Debug command`)
        .addStringOption(opt =>
			opt.setName('command')
			.setDescription('What eval to attempt to run...')
			.setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // Hide this from most people to limit people who can attempt anyway
    async execute(interaction) {
		try {
			if (interaction.user.id !== interaction.client?.application?.owner?.id) {
                await interaction.reply(`You're not ${interaction.client?.application?.owner?.displayName}. Go away.`)
                return
            }
			let command = interaction.options.getString("command")
            let res;
            try {
                res = eval(command)
            }
            catch (err) {
                await interaction.reply({ content: err.toString(), flags: MessageFlags.Ephemeral })
            }
            if (res) {
                await interaction.reply({ content: `Eval result: ${res}`, flags: MessageFlags.Ephemeral })
            }
            else {
                await interaction.reply({ content: `Command run. No return value.`, flags: MessageFlags.Ephemeral })
            }
		}
		catch (err) {
			console.log(err)
		}
    }
}