const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { inspectModal } = require('../../functions/outfitfunctions');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Inspect User')
        .setType(ApplicationCommandType.User), // This command will appear when right-clicking a user
    async execute(interaction) {
        try {
            interaction.reply(await inspectModal(interaction.user.id, interaction.targetId ?? interaction.user.id, "overview", 1))
        } catch (err) {
            console.log(err);
        }
    },
}