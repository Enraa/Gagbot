const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { deleteGag, deleteMitten } = require('./../functions/gagfunctions.js')
const { removeChastity, removeVibe } = require('./../functions/vibefunctions.js')
const { removeCollar } = require('./../functions/collarfunctions.js')
const { removeHeavy } = require('./../functions/heavyfunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription(`Moderator Only: Reset all restrictions on a user`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to reset')
		),
    async execute(interaction) {
		let resetuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
        if (interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            // User has the permission, proceed with the action (e.g., a purge command)
            await interaction.reply({ content: `Resetting ${resetuser}`,  flags: MessageFlags.Ephemeral });
            deleteGag(resetuser.id)
            deleteMitten(resetuser.id)
            removeChastity(resetuser.id)
            removeVibe(resetuser.id)
            removeCollar(resetuser.id)
            removeHeavy(resetuser.id)
        } else {
            if (interaction.member.roles.cache.has("1073505965619564604")) { 
                // User has the safeword role, we should remove all their restraints because they safeworded
                await interaction.reply({ content: 'Resetting all of your restraints because you are safeworded.',  flags: MessageFlags.Ephemeral });
                deleteGag(interaction.user.id)
                deleteMitten(interaction.user.id)
                removeChastity(interaction.user.id)
                removeVibe(interaction.user.id)
                //removeCollar(interaction.user.id)
                removeHeavy(interaction.user.id)
            }
            else {
                // User does not have the permission, send an error message, but only if they don't have the safeworded role. If they do, then 
                await interaction.reply({ content: 'Please DM a mod about this command if someone needs to be reset.',  flags: MessageFlags.Ephemeral });
            }
        }
    }
}