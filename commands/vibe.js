const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, getVibe, assignVibe } = require('./../functions/vibefunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vibe')
		.setDescription('Add a vibrator, causing stuttered speech and other effects')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('Who to add a fun vibrator to')
        )
		.addNumberOption(opt => 
            opt.setName('intensity')
            .setDescription("How intensely to stimulate")
            .setMinValue(1)
            .setMaxValue(30)
        ),
    async execute(interaction) {
        let vibeuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
		let vibeintensity = interaction.options.getNumber('intensity') ? interaction.options.getNumber('intensity') : 5
        if (getHeavy(interaction.user.id)) {
            if (vibeuser == interaction.user) {
                if (getChastity(vibeuser.id)) {
                    interaction.reply(`${interaction.user} bats around a vibrator despite ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, but ${getPronouns(interaction.user.id, "subject")} can't insert it because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} chastity belt! And well, ${getPronouns(interaction.user.id, "subject")} ${getPronouns(interaction.user.id, "subject") != "they" ? "doesn't" : "don't"} have arms!`)
                }
                else {
                    interaction.reply(`${interaction.user} stares at a vibrator, longing to feel its wonderful vibrations, but sighing in frustration because they are in a ${getHeavy(interaction.user.id).type} and can't put it on!`)
                }
            }
            else {
                if (getChastity(vibeuser.id)) {
                    interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} chin to move a vibrator towards ${vibeuser} before realizing ${getPronouns(interaction.user.id, "subject")} can't put it on them because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type} and ${vibeuser}'s chastity belt!`)
                }
                else {
                    interaction.reply(`${interaction.user} rubs ${getPronouns(interaction.user.id, "possessiveDeterminer")} cheek on the vibrator, trying to move it and put it on ${vibeuser}. It's a shame they don't have arms because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}!`)
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
                        interaction.reply(`${interaction.user} unlocks ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, changing the vibrator setting to ${vibeintensity} and then locks it back up!`)
                        assignVibe(vibeuser.id, vibeintensity)
                    }
                    else {
                        interaction.reply(`${interaction.user} unlocks ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, adding a vibrator set to ${vibeintensity} and then locks it back up!`)
                        assignVibe(vibeuser.id, vibeintensity)
                    }
                }
                else {
                    // User tries to modify another user's vibe settings
                    if (getVibe(vibeuser.id)) {
                        // User already has a vibrator on
                        interaction.reply(`${interaction.user} unlocks ${vibeuser}'s belt, changing the vibrator setting to ${vibeintensity} and then locks it back up!`)
                        assignVibe(vibeuser.id, vibeintensity)
                    }
                    else {
                        interaction.reply(`${interaction.user} unlocks ${vibeuser}'s belt, adding a vibrator set to ${vibeintensity} and then locks it back up!`)
                        assignVibe(vibeuser.id, vibeintensity)
                    }
                }
            }
            else {
                // User tries to modify vibe settings but does not have the key for the belt
                if (vibeuser == interaction.user) {
                    // User tries to modify their own vibe settings while in chastity
                    if (getVibe(vibeuser.id)) {
                        // User already has a vibrator on
                        interaction.reply(`${interaction.user} claws at ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, feverishly trying to change the vibrator settings, but can't!`)
                    }
                    else {
                        interaction.reply(`${interaction.user} runs ${getPronouns(interaction.user.id, "possessiveDeterminer")} fingers on ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, trying to turn on a vibrator, but can't!`)
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
                    interaction.reply(`${interaction.user} changes ${getPronouns(interaction.user.id, "possessiveDeterminer")} vibrator setting to ${vibeintensity}!`)
                    assignVibe(vibeuser.id, vibeintensity)
                }
                else {
                    interaction.reply(`${interaction.user} slips on a vibrator set to ${vibeintensity}!`)
                    assignVibe(vibeuser.id, vibeintensity)
                }
            }
            else {
                // User tries to modify another user's vibe settings
                if (getVibe(vibeuser.id)) {
                    // User already has a vibrator on
                    interaction.reply(`${interaction.user} changes ${vibeuser}'s vibrator to ${vibeintensity}!`)
                    assignVibe(vibeuser.id, vibeintensity)
                }
                else {
                    interaction.reply(`${interaction.user} slips a vibrator on ${vibeuser} set to ${vibeintensity}!`)
                    assignVibe(vibeuser.id, vibeintensity)
                }
            }
        }
    }
}