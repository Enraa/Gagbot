const { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags } = require('discord.js');
const { handleConsent } = require('../../functions/interactivefunctions');
const { handleTouchEvent, rollPatChance } = require('../../functions/touchfunctions');
const { getText } = require('../../functions/textfunctions');
const { getAllSelectedOption } = require('../../functions/getters/config/getAllSelectedOption');
const { getConsent } = require('../../functions/getters/config/getConsent');
const { getPronouns } = require('../../functions/getters/config/getPronouns');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Headpat')
        .setType(ApplicationCommandType.Message), // This command will appear when right-clicking a message
    async execute(interaction) {
        try {
            let channel = await interaction.client.channels.fetch(interaction.channelId)
            if (channel) {
                let message = await channel.messages.fetch(interaction.targetId)
                let targetuser;
                if (message) {
                    if (message.webhookId == null) {
                        targetuser = await message.guild.members.fetch(message.author.id)
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
                        if (founduserid) {
                            targetuser = await message.guild.members.fetch(founduserid)
                        }
                    }
                    if (targetuser) {
                        // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
                        if (!getConsent(interaction.guildId, targetuser.id)?.mainconsent) {
                            await handleConsent(interaction, targetuser.id);
                            return;
                        }
                        // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
                        if (!getConsent(interaction.guildId, interaction.user.id)?.mainconsent) {
                            await handleConsent(interaction, interaction.user.id);
                            return;
                        }
                        // Build data tree:
                        let data = {
                            textarray: "texts_touch",
                            textdata: {
                                serverID: interaction.guildId, 
                                interactionuser: interaction.user,
                                targetuser: targetuser,
                                //c1: getHeavy(interaction.user.id)?.displayname, // heavy bondage type
                                //c2: getMittenName(interaction.user.id, chosenmittens) ?? "Standard Mittens",
                            },
                        };
                        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                        await handleTouchEvent(interaction.guildId, interaction.user, targetuser, "headpat").then(
                            async (success) => {
                                await interaction.followUp({ content: `Headpatting ${targetuser}`, flags: MessageFlags.Ephemeral })
                                let headpatattempt = rollPatChance(interaction.guildId, interaction.user.id, targetuser.id, interaction.guildId)
                                data.headpat = true;

                                if (interaction.user.id == targetuser.id) {
                                    data.self = true;
                                }
                                else {
                                    data.other = true;
                                }

                                if (headpatattempt.hit) {
                                    data.hit = true;
                                }
                                else {
                                    data.nohit = true;
                                }

                                if (headpatattempt.crit) {
                                    if (headpatattempt.doublecrit) {
                                        if (headpatattempt.triplecrit) {
                                            data.triplecrit = true;
                                        }
                                        else {
                                            data.doublecrit = true
                                        }
                                    }
                                    else {
                                        data.crit = true;
                                    }
                                }
                                else {
                                    data.nocrit = true;
                                }

                                if (headpatattempt.boundmiss) {
                                    data[headpatattempt.boundmiss] = true;
                                }
                                else {
                                    data.noboundmiss = true;
                                }

                                interaction.followUp({ content: getText(data) });
                            },
                            async (reject) => {
                                let nomessage = `${targetuser} rejected the headpat.`;
                                if (reject == "Error") {
                                    nomessage = `Something went wrong - Submit a bug report!`;
                                }
                                if (reject == "NoDM") {
                                    nomessage = `Something went wrong sending a DM to ${targetuser}, or ${getPronouns(interaction.guildId, targetuser.id, "subject")} ${getPronouns(interaction.guildId, targetuser.id, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent to touch.`;
                                }
                                await interaction.followUp({ content: nomessage });
                            },
                        )
                    }
                    else {
                        interaction.reply({ content: `Cannot determine user to headpat...`, flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    interaction.reply({ content: `Cannot determine user to headpat...`, flags: MessageFlags.Ephemeral })
                }
            }
            else {
                interaction.reply({ content: `Cannot determine user to headpat...`, flags: MessageFlags.Ephemeral })
            }
        } catch (err) {
            console.log(err);
        }
    },
}