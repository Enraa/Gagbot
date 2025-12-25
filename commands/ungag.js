const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getGag, deleteGag, getMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

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
            if (getHeavy(interaction.user.id)) {
                if (gaggeduser != interaction.user) {
                    if (getGag(gaggeduser.id)) {
                        interaction.reply(`${interaction.user} bumps into ${gaggeduser}, trying to use ${getPronouns(interaction.user.id, "possessiveDeterminer")} useless arms to help ${getPronouns(gaggeduser.id, "object")} out of ${getPronouns(gaggeduser.id, "possessiveDeterminer")} gag!`)
                    }
                    else {
                        interaction.reply({ content: `${gaggeduser} is not gagged!`, flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    if (getGag(gaggeduser.id)) {
                        interaction.reply(`${interaction.user} chews on ${getPronouns(interaction.user.id, "possessiveDeterminer")} gag, trying to spit it out because ${getPronouns(interaction.user.id, "subject")} can't use ${getPronouns(interaction.user.id, "possessiveDeterminer")} hands and arms!`)
                    }
                    else {
                        // User is in some form of heavy bondage and cannot put on a chastity belt
                        interaction.reply({ content: `You're not gagged, but you wouldn't be able to take it off anyway!`, flags: MessageFlags.Ephemeral })
                    }
                }
            }
            else if (getGag(gaggeduser.id)) {
                if (interaction.user == gaggeduser) {
                    if (!getMitten(interaction.user.id)) {
                        interaction.reply(`${interaction.user} has taken ${getPronouns(interaction.user.id, "possessiveDeterminer")} gag out!`)
                        deleteGag(gaggeduser.id)
                    }
                    else {
                        interaction.reply(`${interaction.user} attempts to take ${getPronouns(interaction.user.id, "possessiveDeterminer")} gag off, but struggles with the straps in ${getPronouns(interaction.user.id, "possessiveDeterminer")} mittens!`)
                    }
                }
                else {
                    deleteGag(gaggeduser.id)
                    interaction.reply(`${interaction.user} has freed ${gaggeduser} from ${getPronouns(gaggeduser.id, "possessiveDeterminer")} gag!`)
                }
            }
            else {
                if (interaction.user != gaggeduser) {
                    interaction.reply({ content: `${gaggeduser} is not gagged!`, flags: MessageFlags.Ephemeral })
                }
                else {
                    interaction.reply({ content: `You are not gagged!`, flags: MessageFlags.Ephemeral })
                }
            }
        }
        catch (err) {
            
        }
    }
}