const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, getVibe, removeVibe } = require('./../functions/vibefunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unvibe')
		.setDescription('Remove a vibrator')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('Who to remove the vibrator from')
        ),
    async execute(interaction) {
        try {
            let vibeuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            if (getHeavy(interaction.user.id)) {
                if (vibeuser == interaction.user) {
                    if (getChastity(vibeuser.id)) {
                        interaction.reply(`${interaction.user} tries to knock ${getPronouns(interaction.user.id, "possessiveDeterminer")} vibrator off with ${getPronouns(interaction.user.id, "possessiveDeterminer")} thighs, but ${getPronouns(interaction.user.id, "subject")} can't because ${getPronouns(interaction.user.id, "possessiveDeterminer")} arms are useless from ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}. Well, and ${getPronouns(interaction.user.id, "possessiveDeterminer")} chastity belt of course!`)
                    }
                    else {
                        interaction.reply(`${interaction.user}'s ${getHeavy(interaction.user.id).type} prevents ${getPronouns(interaction.user.id, "object")} from dexterously reaching the vibrator taped to ${getPronouns(interaction.user.id, "reflexive")}!`)
                    }
                }
                else {
                    if (getChastity(vibeuser.id)) {
                        interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} nose to try to shift the vibrator off of ${vibeuser} because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, but is immediately stopped by the metal shield protecting it!`)
                    }
                    else {
                        interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} nose to try to shift the vibrator off of ${vibeuser} because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}. The move failed!`)
                    }
                }
            }
            else if (getChastity(vibeuser.id)) {
                // The target is in a chastity belt
                if ((getChastity(vibeuser.id)?.keyholder == interaction.user.id)) {
                    // User tries to modify the vibe settings for someone in chastity that they do have the key for
                    if (vibeuser == interaction.user) {
                        // User tries to modify their own vibe settings while in chastity
                        if (getVibe(vibeuser.id)) {
                            // User already has a vibrator on
                            interaction.reply(`${interaction.user} unlocks ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, removing ${getPronouns(interaction.user.id, "possessiveDeterminer")} vibrator and then locks it back up!`)
                            removeVibe(vibeuser.id)
                        }
                        else {
                            interaction.reply({ content: `You don't have a vibrator on!`, flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // User tries to modify another user's vibe settings
                        if (getVibe(vibeuser.id)) {
                            // User already has a vibrator on
                            interaction.reply(`${interaction.user} unlocks ${vibeuser}'s belt, removing the vibrator and then locks it back up!`)
                            removeVibe(vibeuser.id)
                        }
                        else {
                            interaction.reply({ content: `${vibeuser} does not have a vibrator on!`, flags: MessageFlags.Ephemeral })
                        }
                    }
                }
                else {
                    // User tries to modify vibe settings but does not have the key for the belt
                    if (vibeuser == interaction.user) {
                        // User tries to modify their own vibe settings while in chastity
                        if (getVibe(vibeuser.id)) {
                            // User already has a vibrator on
                            interaction.reply(`${interaction.user} claws at ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, desperately trying to take out the teasing vibrator, but can't!`)
                        }
                        else {
                            interaction.reply({ content: `You don't have a vibrator on!`, flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // User tries to modify another user's vibe settings
                        interaction.reply({ content: `You do not have the key for ${vibeuser}'s chastity belt!`, flags: MessageFlags.Ephemeral })
                    }
                }
            }
            else {
                // Target is NOT in a chastity belt!
                if (vibeuser == interaction.user) {
                    // User tries to modify their own vibe settings
                    if (getVibe(vibeuser.id)) {
                        // User already has a vibrator on
                        interaction.reply(`${interaction.user} takes ${getPronouns(interaction.user.id, "possessiveDeterminer")} vibrator out!`)
                        removeVibe(vibeuser.id)
                    }
                    else {
                        interaction.reply({ content: `You don't have a vibrator on!`, flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    // User tries to modify another user's vibe settings
                    if (getVibe(vibeuser.id)) {
                        // User already has a vibrator on
                        interaction.reply(`${interaction.user} takes the vibrator out from ${vibeuser}!`)
                        removeVibe(vibeuser.id)
                    }
                    else {
                        interaction.reply({ content: `${vibeuser} does not have a vibrator on!`, flags: MessageFlags.Ephemeral })
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}