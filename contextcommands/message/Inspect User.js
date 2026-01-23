const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { inspectModal } = require('../../functions/outfitfunctions');
const { getAllSelectedOption } = require('../../functions/configfunctions');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Inspect User')
        .setType(ApplicationCommandType.Message), // This command will appear when right-clicking a message
    async execute(interaction) {
        try {
            let channel = await interaction.client.channels.fetch(interaction.channelId)
            if (channel) {
                let message = await channel.messages.fetch(interaction.targetId)
                if (message) {
                    if (message.webhookId == null) {
                        interaction.reply(await inspectModal(interaction.user.id, message.author.id ?? interaction.user.id, "overview", 1))
                    }
                    else {
                        let founduserid;
                        let dollvisorids = getAllSelectedOption("dollvisorname")
                        Object.keys(dollvisorids).forEach((k) => {
                            // If the visor matches, then we found our doll!
                            if (message.author.username.startsWith(dollvisorids[k])) {
                                founduserid = k
                            }
                        })
                        // They're probably not visored, so lets search and see if we can find
                        // them in the guild list. 
                        if (!founduserid) {
                            let membername = await message.guild.members.search({ query: message.author.username, limit: 1 });
                            if (membername) {
                                founduserid = membername.first().user.id
                            }
                        }
                        interaction.reply(await inspectModal(interaction.user.id, founduserid ?? interaction.user.id, "overview", 1))
                    }
                }
                else {
                    interaction.reply(await inspectModal(interaction.user.id, interaction.user.id, "overview", 1))
                }
            }
            else {
                interaction.reply(await inspectModal(interaction.user.id, interaction.user.id, "overview", 1))
            }
        } catch (err) {
            console.log(err);
        }
    },
}