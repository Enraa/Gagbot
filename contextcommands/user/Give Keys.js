const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { generateKeyGivingModal } = require('../../functions/interactivefunctions');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Give Keys')
        .setType(ApplicationCommandType.User), // This command will appear when right-clicking a user
    async execute(interaction) {
        try {
            interaction.reply(await generateKeyGivingModal(interaction.user.id, interaction.targetId ?? interaction.user.id, interaction.targetId ?? interaction.user.id, "0000"))
        } catch (err) {
            console.log(err);
        }
    },
}