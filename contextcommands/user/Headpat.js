const { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags } = require('discord.js');
const { handleConsent } = require('../../functions/interactivefunctions');
const { handleTouchEvent, rollPatChance } = require('../../functions/touchfunctions');
const { getText } = require('../../functions/textfunctions');
const { getConsent } = require('../../functions/getters/config/getConsent');
const { getPronouns } = require('../../functions/getters/config/getPronouns');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Headpat')
        .setType(ApplicationCommandType.User), // This command will appear when right-clicking a user
    async execute(interaction) {
        try {
            let targetuser = await interaction.guild.members.fetch(interaction.targetId)
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
        } catch (err) {
            console.log(err);
        }
    },
}