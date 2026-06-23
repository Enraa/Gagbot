const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { inspectModal } = require('../../functions/outfitfunctions');
const { getAllSelectedOption } = require('../../functions/getters/config/getAllSelectedOption');

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
                        interaction.reply(await inspectModal(interaction.guildId, interaction.user.id, message.author.id ?? interaction.user.id, "overview", 1))
                    }
                    else {
                        let founduserid;
                        // Check for engraved pet tag
                        let engravedpettags = getAllSelectedOption(interaction.guildId, "engravedcollarname")
                        Object.keys(engravedpettags).forEach((k) => {
                            // If the visor matches, then we found our pet!
                            if (message.author.username.startsWith(engravedpettags[k]) && (engravedpettags[k].length > 0)) {
                                console.log(`Matched ${k}`);
                                founduserid = k
                            }
                        })
                        // Doll Visors
                        let dollvisorids = getAllSelectedOption(interaction.guildId, "dollvisorname")
                        Object.keys(dollvisorids).forEach((k) => {
                            // If the visor matches, then we found our doll!
                            if (message.author.username.startsWith(dollvisorids[k])) {
                                founduserid = k
                            }
                        })
                        // Drone Visors
                        let dronevisorids = getAllSelectedOption(interaction.guildId, "dronevisorname")
                        Object.keys(dronevisorids).forEach((k) => {
                            // If the visor matches, then we found our drone!
                            if (message.author.username.startsWith(`⬡-Drone ${dronevisorids[k]}`)) {
                                founduserid = k
                            }
                        })
                        // They're probably not visored, so lets search and see if we can find
                        // Attempt to find the user ID in our recent messages list
                        if (process.recordedmessages && process.recordedmessages[message.id]) {
                            founduserid = process.recordedmessages[message.id].authorid
                        }
                        // them in the guild list. 
                        if (!founduserid) {
                            let membername = await message.guild.members.search({ query: message.author.username, limit: 10 });
                            if (membername) {
                                console.log(membername)
                                for (const [userid, member] of membername) {
                                    // Exact match
                                    if (member.nickname == message.author.username) {
                                        founduserid = member.id
                                    }
                                    // Parenthesis match
                                    else if (message.author.username.endsWith(`(${membername})`)) {
                                        founduserid = member.id
                                    }
                                    // Yeah I dunno at this point.
                                }
                                // Just target the first if we cant get a good guess
                                if (!founduserid) {
                                    founduserid = membername.first().user.id
                                }
                            }
                        }
                        interaction.reply(await inspectModal(interaction.guildId, interaction.user.id, founduserid ?? interaction.user.id, "overview", 1))
                    }
                }
                else {
                    interaction.reply(await inspectModal(interaction.guildId, interaction.user.id, interaction.user.id, "overview", 1))
                }
            }
            else {
                interaction.reply(await inspectModal(interaction.guildId, interaction.user.id, interaction.user.id, "overview", 1))
            }
        } catch (err) {
            console.log(err);
        }
    },
}