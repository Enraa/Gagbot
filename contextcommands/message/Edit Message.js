// Allows a user to edit a message if they were webhooked using an edit modal. 
const { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags } = require('discord.js');
const { getAllSelectedOption } = require('../../functions/configfunctions');
const { generateEditMessageModal } = require('../../functions/interactivefunctions');
const { modalexecute } = require('../../commands/config');
const { modifymessage } = require('../../functions/gagfunctions');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Edit Message')
        .setType(ApplicationCommandType.Message), // This command will appear when right-clicking a message
    async execute(interaction) {
        try {
            if (process.webhook && process.webhook[interaction.channelId]) {
                let channel = await interaction.client.channels.fetch(interaction.channelId)
                if (channel) {
                    let message = await channel.messages.fetch(interaction.targetId)
                    if (message) {
                        if (message.webhookId != null) {
                            // Determine which webhook sent this message.
                            let webhookassigned;
                            if ((process.webhook[interaction.channelId]?.bot.id == message.webhookId)) { webhookassigned = false }
                            else if ((process.webhook[interaction.channelId]?.human.id == message.webhookId)) { webhookassigned = true }
                            else {
                                console.log(message.webhookId)
                                console.log(interaction.channelId)
                                console.log(process.webhook)
                                interaction.reply({ content: "This is not a message sent by Gagbot's webhook and cannot be edited.", flags: MessageFlags.Ephemeral })
                                return;
                            }

                            let founduserid;
                            let dollvisorids = getAllSelectedOption("dollvisorname")
                            Object.keys(dollvisorids).forEach((k) => {
                                // If the visor matches, then we found our doll!
                                if (message.author.username.startsWith(dollvisorids[k])) {
                                    founduserid = k
                                }
                            })
                            // They're probably not visored, so lets search and see if we can find
                            // them in the guild list. We'll allow for top 5 results to try to allow for some grace in confidence here. 
                            if (!founduserid) {
                                let membername = await message.guild.members.search({ query: message.author.username, limit: 3 });
                                if (membername) {
                                    let members = membername.map(member => member.user.id)
                                    if (members.includes(interaction.user.id)) {
                                        founduserid = interaction.user.id;
                                    }
                                }
                            }
                            if (founduserid == interaction.user.id) {
                                interaction.showModal(await generateEditMessageModal(message.content, message.id, message.channel.id, webhookassigned))
                            }
                            else {
                                interaction.reply({ content: "This is (probably) not your message and cannot be edited. Let Enraa know if this is an error.", flags: MessageFlags.Ephemeral })
                                return;
                            }
                        }
                        else {
                            interaction.reply({ content: "This is not a webhooked message and cannot be edited!", flags: MessageFlags.Ephemeral })
                            return;
                        }
                    }
                    else {
                        interaction.reply({ content: "Error locating message. Please let Enraa know.", flags: MessageFlags.Ephemeral })
                        return;
                    }
                }
                else {
                    interaction.reply({ content: "Error locating channel. Please let Enraa know.", flags: MessageFlags.Ephemeral })
                    return;
                }
            }
            else {
                interaction.reply({ content: "Webhooks have not been set for this channel.", flags: MessageFlags.Ephemeral })
                return;
            }
        }
        catch (err) {
            console.log(err);
        }
    },
    async modalexecute(interaction) {
        try {
            let usereditedtext = interaction.fields.getTextInputValue(`textedit`)
            // Split into 4 parts: "webhookedit", message id, channel id and h/b for human or bot webhook. 
            let optionparts = interaction.customId.split("_");
            let originalmessagechannel = await interaction.client.channels.fetch(optionparts[2]);
            if (originalmessagechannel) {
                let originalmessage = await originalmessagechannel.messages.fetch(optionparts[1])
                if (originalmessage) {
                    console.log(originalmessage)
                    let newmessage = Object.assign({}, originalmessage)
                    newmessage.content = usereditedtext;
                    newmessage.guild = interaction.guild;
                    newmessage.author = interaction.user;
                    newmessage.member = interaction.member;
                    let garbled = await modifymessage(newmessage, null, true);
                    if (garbled) {
                        if (process.webhook && process.webhook[optionparts[2]]) {
                            let webhookClient = process.webhook[optionparts[2]].human;
                            if (optionparts[3] == "b") { webhookClient = process.webhook[optionparts[2]].bot }
                            webhookClient.editMessage(originalmessage, garbled).then(() => {
                                interaction.deferUpdate();
                                //interaction.reply({ content: "Message successfully edited.", flags: MessageFlags.Ephemeral })
                            })
                        }
                        else {
                            interaction.reply({ content: "The webhook for this channel is missing.", flags: MessageFlags.Ephemeral })
                            return;
                        }
                    }
                    else {
                        interaction.reply({ content: "The original message's contents are identical.", flags: MessageFlags.Ephemeral })
                        return;
                    }
                }
                else {
                    interaction.reply({ content: "The original message cannot be found.", flags: MessageFlags.Ephemeral })
                    return;
                }
            }
            else {
                interaction.reply({ content: "This channel apparently doesn't exist!", flags: MessageFlags.Ephemeral })
                return;
            }
        }
        catch (err) {
            console.log(err);
            interaction.reply({ content: "Something went wrong editing this message.", flags: MessageFlags.Ephemeral })
        }
    }
}