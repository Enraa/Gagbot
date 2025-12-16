const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getCollar, removeCollar } = require('./../functions/collarfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uncollar')
		.setDescription(`Unlock a collar`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Whose collar to unlock (blank for your own)')
		),
    async execute(interaction) {
        try {
            let collaruser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
            if (getHeavy(interaction.user.id)) {
                if (getCollar(interaction.user.id)) {
                    interaction.reply(`${interaction.user} crinks ${getPronouns(interaction.user.id, "possessiveDeterminer")} neck, trying to take off ${getPronouns(interaction.user.id, "possessiveDeterminer")} collar, but without ${getPronouns(interaction.user.id, "possessiveDeterminer")} arms due to ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, ${getPronouns(interaction.user.id, "subject")} can't!`)
                }
                else {
                    interaction.reply({ content: `You aren't wearing a collar, but you wouldn't be able to take it off even if you were!`, flags: MessageFlags.Ephemeral })
                }
            }
            else if (getCollar(collaruser.id)) {
                if (getCollar(collaruser.id).keyholder == interaction.user.id) {
                    if (collaruser == interaction.user) {
                        // We have the key for our collar!
                        interaction.reply(`${interaction.user} leans forward to let ${getPronouns(interaction.user.id, "possessiveDeterminer")} hair fall forward, then puts a key in the tiny lock and unlocks ${getPronouns(interaction.user.id, "possessiveDeterminer")} collar, undoing the buckle and putting it away!`)
                        removeCollar(collaruser.id)
                    }
                    else {
                        // We have the key for someone else's collar!
                        interaction.reply(`${interaction.user} gently brushes ${collaruser}'s hair out of the way before a click is heard from ${getPronouns(collaruser.id, "possessiveDeterminer")} collar and the buckles is undone!`)
                        removeCollar(collaruser.id)
                    }
                }
                else {
                    if (collaruser == interaction.user) {
                        // We do NOT have the key for our collar!
                        interaction.reply(`${interaction.user} tugs at ${getPronouns(interaction.user.id, "possessiveDeterminer")} collar, trying to shift or loosen it, but the leather barely creaks as it remains firmly around ${getPronouns(interaction.user.id, "possessiveDeterminer")} neck!`)
                    }
                    else {
                        if (!getCollar(collaruser.id).keyholder_only) {
                            interaction.reply({ content: `${collaruser}'s collar is unlocked, but you shouldn't touch it!`, flags: MessageFlags.Ephemeral })
                        }
                        else {
                            // We DON'T have the key for someone else's collar!
                            interaction.reply({ content: `You don't have the key to ${collaruser}'s collar!`, flags: MessageFlags.Ephemeral })
                        }
                    }
                }
            }
            else {
                if (collaruser == interaction.user) {
                    // We aren't wearing a collar
                    interaction.reply({ content: `You aren't wearing a collar!`, flags: MessageFlags.Ephemeral })
                }
                else {
                    // They aren't wearing a collar
                    interaction.reply({ content: `${collaruser} is not wearing a collar!`, flags: MessageFlags.Ephemeral })
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}