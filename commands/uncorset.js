const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity } = require('./../functions/vibefunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getCorset, removeCorset } = require('./../functions/corsetfunctions.js');
const { optins } = require('../functions/optinfunctions.js');
const { rollKeyFumbleN } = require('../functions/keyfindingfunctions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uncorset')
		.setDescription('Remove a corset')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('Who to remove the corset from')
        ),
    async execute(interaction) {
        try {
            let corsetuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            if (getHeavy(interaction.user.id)) {
                if (corsetuser == interaction.user) {
                    if (getChastity(corsetuser.id)) {
                        interaction.reply(`${interaction.user} tries to squeeze out of ${getPronouns(interaction.user.id, "possessiveDeterminer")} corset, but ${getPronouns(interaction.user.id, "subject")} can't because ${getPronouns(interaction.user.id, "possessiveDeterminer")} can't get a good grasp on the laces. ${getPronouns(interaction.user.id, "possessiveDeterminer", true)} ${getHeavy(interaction.user.id).type} probably has nothing to do it, nor ${getPronouns(interaction.user.id, "possessiveDeterminer")} chastity belt!`)
                    }
                    else {
                        interaction.reply(`${interaction.user}'s ${getHeavy(interaction.user.id).type} prevents ${getPronouns(interaction.user.id, "object")} from wriggling into a corset. Poor ${getPronouns(interaction.user.id, "object")}, ${getPronouns(interaction.user.id, "subject")} wants to look pretty!`)
                    }
                }
                else {
                    if (getChastity(corsetuser.id)) {
                        interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} elbow to try to wrap a corset around ${corsetuser}. It's a bit challenging because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type} though, to say nothing of the unyielding protective chastity belt!`)
                    }
                    else {
                        interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} forehead to move a corset around on the floor towards ${corsetuser}. ${getPronouns(interaction.user.id, "possessiveDeterminer", true)} ${getHeavy(interaction.user.id).type} makes it difficult to hold the laces.`)
                    }
                }
            }
            else if (getChastity(corsetuser.id)) {
                // The target is in a chastity belt
                if ((getChastity(corsetuser.id)?.keyholder == interaction.user.id || (getChastity(corsetuser.id)?.access === 0 && corsetuser.id != interaction.user.id))) {
                    // User tries to modify the corset settings for someone in chastity that they do have the key for
                    const fumbleResults = (chastitywearer.id == interaction.user.id || optins.getOthersKeyFumbling(chastitywearer.id)) ? rollKeyFumbleN(interaction.user.id, 2) : [false, false];
                    if (fumbleResults[0]) {
                        // User fumbles with the key due to their arousal and frustration
                        if (optins.getKeyDiscarding(corsetuser.id) && fumbleResults[1]) {
                            // if they fumble again they can lose the key
                            if (corsetuser == interaction.user) {
                                // User tries to modify their own corset settings while in chastity
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    interaction.reply(`${interaction.user} tries to unlock ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt to remove ${getPronouns(interaction.user.id, "possessiveDeterminer")} corset but fumbles with the key so much with the key that they drop it somewhere so ${corsetuser} will remain just as out of breath as before!`);
                                    discardChastityKey(corsetuser.id);
                                }
                                else {
                                    interaction.reply({ content: `You don't have a corset on!`, flags: MessageFlags.Ephemeral })
                                }
                            } else {
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    interaction.reply(`${interaction.user} tries to unlock ${corsetuser}'s belt to remove ${getPronouns(corsetuser.id, "possessiveDeterminer")} corset but fumbles with the key so much with the key that they drop it somewhere so ${corsetuser} will remain just as out of breath as before!`);
                                    discardChastityKey(corsetuser.id);
                                }
                                else {
                                    interaction.reply({ content: `${corsetuser} does not have a corset on!`, flags: MessageFlags.Ephemeral })
                                }
                            }
                        } else {
                            if (corsetuser == interaction.user) {
                                // User tries to modify their own corset settings while in chastity
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    interaction.reply(`${interaction.user} tries to unlock ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt to remove ${getPronouns(interaction.user.id, "possessiveDeterminer")} corset but fumbles with the key so ${corsetuser} will remain just as out of breath as before!`);
                                }
                                else {
                                    interaction.reply({ content: `You don't have a corset on!`, flags: MessageFlags.Ephemeral })
                                }
                            }
                            else {
                                // User tries to modify another user's vibe settings
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    interaction.reply(`${interaction.user} tries to unlock ${corsetuser}'s belt to remove ${getPronouns(corsetuser.id, "possessiveDeterminer")} corset but fumbles with the key so ${corsetuser} will remain just as out of breath as before!`);
                                }
                                else {
                                    interaction.reply({ content: `${corsetuser} does not have a corset on!`, flags: MessageFlags.Ephemeral })
                                }
                            }
                        }
                    } else {
                        if (corsetuser == interaction.user) {
                            // User tries to modify their own corset settings while in chastity
                            if (getCorset(corsetuser.id)) {
                                // User already has a corset on
                                interaction.reply(`${interaction.user} unlocks ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, removing ${getPronouns(interaction.user.id, "possessiveDeterminer")} corset and then locks ${getPronouns(interaction.user.id, "reflexive")} back up!`)
                                removeCorset(corsetuser.id)
                            }
                            else {
                                interaction.reply({ content: `You don't have a corset on!`, flags: MessageFlags.Ephemeral })
                            }
                        }
                        else {
                            // User tries to modify another user's corset settings
                            if (getCorset(corsetuser.id)) {
                                // User already has a corset on
                                interaction.reply(`${interaction.user} unlocks ${corsetuser}'s belt, undoing and removing ${getPronouns(corsetuser.id, "possessiveDeterminer")} corset and then locks ${getPronouns(corsetuser.id, "object")} back up!`)
                                removeCorset(corsetuser.id)
                            }
                            else {
                                interaction.reply({ content: `${corsetuser} does not have a corset on!`, flags: MessageFlags.Ephemeral })
                            }
                        }
                    }
                }
                else {
                    // User tries to modify corset settings but does not have the key for the belt
                    if (corsetuser == interaction.user) {
                        // User tries to modify their own corset settings while in chastity
                        if (getCorset(corsetuser.id)) {
                            // User already has a corset on
                            interaction.reply(`${interaction.user} shifts ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, trying to loosen it so ${getPronouns(interaction.user.id, "subject")} can get some relief to breathe, but it won't budge!`)
                        }
                        else {
                            interaction.reply({ content: `You don't have a corset on!`, flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // User tries to modify another user's corset settings
                        interaction.reply({ content: `You do not have the key for ${corsetuser}'s chastity belt!`, flags: MessageFlags.Ephemeral })
                    }
                }
            }
            else {
                // Target is NOT in a chastity belt!
                if (corsetuser == interaction.user) {
                    // User tries to modify their own corset settings
                    if (getCorset(corsetuser.id)) {
                        // User already has a corset on
                        interaction.reply(`${interaction.user} takes ${getPronouns(interaction.user.id, "possessiveDeterminer")} corset off after undoing the laces!`)
                        removeCorset(corsetuser.id)
                    }
                    else {
                        interaction.reply({ content: `You don't have a corset on!`, flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    // User tries to modify another user's corset settings
                    if (getCorset(corsetuser.id)) {
                        // User already has a corset on
                        interaction.reply(`${interaction.user} undoes the laces and helps ${corsetuser} out of ${getPronouns(interaction.user.id, "possessiveDeterminer")} corset!`)
                        removeCorset(corsetuser.id)
                    }
                    else {
                        interaction.reply({ content: `${corsetuser} does not have a corset on!`, flags: MessageFlags.Ephemeral })
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}