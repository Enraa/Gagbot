const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, removeChastity } = require('./../functions/vibefunctions.js')
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unchastity')
		.setDescription('Remove a chastity belt from someone')
		.addUserOption(opt =>
			opt.setName('wearer')
			.setDescription('Who to unlock...')
		),
    async execute(interaction) {
        try {
            let chastitywearer = interaction.options.getUser('wearer') ? interaction.options.getUser('wearer') : interaction.user
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            if (getHeavy(interaction.user.id)) {
                if (getChastity(interaction.user.id)) {
                    interaction.reply(`${interaction.user} shifts in ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, trying to squirm out of ${getPronouns(interaction.user.id, "possessiveDeterminer")} chastity belt, but ${getPronouns(interaction.user.id, "possessiveDeterminer")} metal prison holds firmly to ${getPronouns(interaction.user.id, "possessiveDeterminer")} body!`)
                }
                else {
                    // User is in some form of heavy bondage and cannot put on a chastity belt
                    interaction.reply({ content: `You're not in a chastity belt, but you wouldn't be able to remove it anyway!`, flags: MessageFlags.Ephemeral })
                }
            }
            else if (getChastity(chastitywearer.id)) {
                // Target is in a belt
                if (getChastity(chastitywearer.id).keyholder != interaction.user.id) {
                    // User is NOT the keyholder for the target belt
                    if (interaction.user == chastitywearer) {
                        // Wearer is trying to unlock their own belt
                        interaction.reply(`${interaction.user} runs ${getPronouns(interaction.user.id, "possessiveDeterminer")} fingers uselessly on the metal of ${getPronouns(interaction.user.id, "possessiveDeterminer")} chastity belt, but ${getPronouns(interaction.user.id, "subject")} can't unlock it without the key!`)
                    }
                    else {
                        // Trying to unlock someone else's belt 
                        interaction.reply({ content: `You don't have the key for ${chastitywearer} belt!`, flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    // User IS the keyholder for the belt. 
                    if (interaction.user == chastitywearer) {
                        // Wearer unlocks themselves
                        interaction.reply(`${interaction.user} puts the key in the lock on ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt and unlocks it, letting it fall as ${getPronouns(interaction.user.id, "subjectIs")} freed from ${getPronouns(interaction.user.id, "possessiveDeterminer")} prison!`)
                        removeChastity(chastitywearer.id)
                    }
                    else {
                        // User unlocks someone else
                        interaction.reply(`${interaction.user} unlocks ${chastitywearer}'s belt and unwraps it from ${getPronouns(interaction.user.id, "possessiveDeterminer")} waist!`)
                        removeChastity(chastitywearer.id)
                    }
                }
            }
            else {
                if (interaction.user == chastitywearer) {
                    interaction.reply({ content: `You aren't locked in a chastity belt!`, flags: MessageFlags.Ephemeral })
                }
                else {
                    // Target is NOT wearing a belt
                    interaction.reply({ content: `${chastitywearer} isn't locked in a chastity belt!`, flags: MessageFlags.Ephemeral })
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}