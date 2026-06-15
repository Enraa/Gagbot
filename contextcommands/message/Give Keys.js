const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { generateKeyGivingModal } = require('../../functions/interactivefunctions');
const { getAllSelectedOption } = require('../../functions/getters/config/getAllSelectedOption');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Give Keys')
        .setType(ApplicationCommandType.Message), // This command will appear when right-clicking a message
    async execute(interaction) {
        try {
            let channel = await interaction.client.channels.fetch(interaction.channelId)
            if (channel) {
                let message = await channel.messages.fetch(interaction.targetId)
                if (message) {
                    if (message.webhookId == null) {
                        interaction.reply(await generateKeyGivingModal(interaction.user.id, message.author.id ?? interaction.user.id, message.author.id ?? interaction.user.id, "0000"))
                    }
                    else {
                        let founduserid;
                        // Check for engraved pet tag
                        let engravedpettags = getAllSelectedOption("engravedcollarname")
                        Object.keys(engravedpettags).forEach((k) => {
                            // If the visor matches, then we found our pet!
                            if (message.author.username.startsWith(engravedpettags[k]) && (engravedpettags[k].length > 0)) {
                                console.log(`Matched ${k}`);
                                founduserid = k
                            }
                        })
                        // Doll Visors
                        let dollvisorids = getAllSelectedOption("dollvisorname")
                        Object.keys(dollvisorids).forEach((k) => {
                            // If the visor matches, then we found our doll!
                            if (message.author.username.startsWith(dollvisorids[k])) {
                                founduserid = k
                            }
                        })
                        // Drone Visors
                        let dronevisorids = getAllSelectedOption("dronevisorname")
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
                        interaction.reply(await generateKeyGivingModal(interaction.user.id, founduserid ?? interaction.user.id, founduserid ?? interaction.user.id, "0000"))
                    }
                }
                else {
                    interaction.reply(await generateKeyGivingModal(interaction.user.id, undefined, undefined, "0000"))
                }
            }
            else {
                interaction.reply(await generateKeyGivingModal(interaction.user.id, undefined, undefined, "0000"))
            }
        } catch (err) {
            console.log(err);
        }
    },
}