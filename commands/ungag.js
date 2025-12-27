const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getGag, deleteGag, getMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getText } = require("./../functions/textfunctions.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ungag')
        .setDescription('Remove a gag from a user')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('The user to remove gag from (leave blank for yourself)')
        ),
    async execute(interaction) {
        try {
            let gaggeduser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            let data = {
                textarray: "texts_ungag",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: gaggeduser,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                }
            }

            // Fuck it, I'm just gonna redo the code path because I've been redoing all the removals anyway. 
            if (getHeavy(interaction.user.id)) {
                // We are in heavy bondage
                data.heavy = true
                if (gaggeduser == interaction.user) {
                    // Trying to ungag ourselves. 
                    data.self = true
                    if (getGag(gaggeduser.id)) {
                        // We are wearing a gag
                        data.gag = true
                        interaction.reply(getText(data))
                    }
                    else {
                        // Not gagged! Ephemeral
                        data.nogag = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    // We are trying to ungag someone else
                    data.other = true
                    if (getGag(gaggeduser.id)) {
                        // They are wearing a gag
                        data.gag = true
                        interaction.reply(getText(data))
                    }
                    else {
                        // Not gagged! Ephemeral
                        data.nogag = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
            }
            else {
                // Not in heavy bondage
                data.noheavy = true
                if (getMitten(interaction.user.id)) {
                    // We are wearing mittens!
                    data.mitten = true
                    if (gaggeduser == interaction.user) {
                        // Trying to ungag ourselves. 
                        data.self = true
                        if (getGag(gaggeduser.id)) {
                            // We are wearing a gag
                            data.gag = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // Not gagged! Ephemeral
                            data.nogag = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // We are trying to ungag someone else
                        data.other = true
                        if (getGag(gaggeduser.id)) {
                            // They are wearing a gag
                            data.gag = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // Not gagged! Ephemeral
                            data.nogag = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                }
                else {
                    // We are NOT wearing mittens!
                    data.nomitten = true
                    if (gaggeduser == interaction.user) {
                        // Trying to ungag ourselves. 
                        data.self = true
                        if (getGag(gaggeduser.id)) {
                            // We are wearing a gag
                            data.gag = true
                            interaction.reply(getText(data))
                            deleteGag(gaggeduser.id)
                        }
                        else {
                            // Not gagged! Ephemeral
                            data.nogag = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // We are trying to ungag someone else
                        data.other = true
                        if (getGag(gaggeduser.id)) {
                            // They are wearing a gag
                            data.gag = true
                            interaction.reply(getText(data))
                            deleteGag(gaggeduser.id)
                        }
                        else {
                            // Not gagged! Ephemeral
                            data.nogag = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}