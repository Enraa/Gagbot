const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, getVibe, removeVibe } = require('./../functions/vibefunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const fs = require('fs');
const path = require('path');

const vibetypes = [];
const commandsPath = path.join(__dirname, '..', 'vibes');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const vibe = require(`./../vibes/${file}`);
	vibetypes.push(
        { name: vibe.choicename, value: file.replace('.js', '') }
    );
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unvibe')
		.setDescription('Remove a vibrator/toy from someone')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('Who to remove the vibrator from')
        ).addStringOption(opt =>
            opt.setName('type')
            .setDescription('What kind of vibrator to remove. Default removes all vibes')
            .addChoices(...vibetypes)
        ),
    async execute(interaction) {
        try {
            let vibeuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
            let vibetype = interaction.options.getString('type') ? interaction.options.getString('type') : null
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            if (getHeavy(interaction.user.id)) {
                if (vibeuser == interaction.user) {
                    if (getChastity(vibeuser.id)) {
                        interaction.reply(`${interaction.user} tries to knock ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${vibetype ? vibetype : "vibrators"} off with ${getPronouns(interaction.user.id, "possessiveDeterminer")} thighs, but ${getPronouns(interaction.user.id, "subject")} can't because ${getPronouns(interaction.user.id, "possessiveDeterminer")} arms are useless from ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}. Well, and ${getPronouns(interaction.user.id, "possessiveDeterminer")} chastity belt of course!`)
                    }
                    else {
                        interaction.reply(`${interaction.user}'s ${getHeavy(interaction.user.id).type} prevents ${getPronouns(interaction.user.id, "object")} from dexterously reaching the ${vibetype ? vibetype : "vibrators"} placed on ${getPronouns(interaction.user.id, "reflexive")}!`)
                    }
                }
                else {
                    if (getChastity(vibeuser.id)) {
                        interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} nose to try to shift the ${vibetype ? vibetype : "vibrators"} off of ${vibeuser} because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, but is immediately stopped by the metal shield protecting it!`)
                    }
                    else {
                        interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} nose to try to shift the ${vibetype ? vibetype : "vibrators"} off of ${vibeuser} because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}. The move failed!`)
                    }
                }
            }
            else if (getChastity(vibeuser.id)) {
                // The target is in a chastity belt
                if ((getChastity(vibeuser.id)?.keyholder == interaction.user.id)) {
                    // User tries to modify the vibe settings for someone in chastity that they do have the key for
                    if (vibeuser == interaction.user) {
                        // User tries to modify their own vibe settings while in chastity
                        if (getVibe(vibeuser.id) && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)) || (!vibetype))) {
                            // User already has a vibrator of the same type on or type is null
                            interaction.reply(`${interaction.user} unlocks ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, removing ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${vibetype ? vibetype : "vibrators"} and then locks it back up!`)
                            removeVibe(vibeuser.id, vibetype)
                        }
                        else {
                            //User doesn't have a vibe of the same type or doesn't have any
                            interaction.reply({ content: `You don't have a ${vibetype ? vibetype : "vibrator"} on!`, flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // User tries to modify another user's vibe settings
                        if (getVibe(vibeuser.id && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)) || (!vibetype)))) {
                            // User already has a vibrator of the same type on or type is null
                            interaction.reply(`${interaction.user} unlocks ${vibeuser}'s belt, removing the ${vibetype ? vibetype : "vibrators"} and then locks it back up!`)
                            removeVibe(vibeuser.id, vibetype)
                        }
                        else {
                            //User doesn't have a vibe of the same type or doesn't have any
                            interaction.reply({ content: `${vibeuser} does not have a ${vibetype ? vibetype : "vibrator"} on!`, flags: MessageFlags.Ephemeral })
                        }
                    }
                }
                else {
                    // User tries to modify vibe settings but does not have the key for the belt
                    if (vibeuser == interaction.user) {
                        // User tries to modify their own vibe settings while in chastity
                        if (getVibe(vibeuser.id) && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)) || (!vibetype))) {
                            // User already has a vibrator of the same type on or type is null
                            interaction.reply(`${interaction.user} claws at ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, desperately trying to take out the teasing ${vibetype ? vibetype : "vibrators"}, but can't!`)
                        }
                        else {
                            //User doesn't have a vibe of the same type or doesn't have any
                            interaction.reply({ content: `You don't have a ${vibetype ? vibetype : "vibrator"} on!`, flags: MessageFlags.Ephemeral })
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
                    if (getVibe(vibeuser.id) && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)) || (!vibetype))) {
                        // User already has a vibrator of the same type on or type is null
                        interaction.reply(`${interaction.user} takes ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${vibetype ? vibetype : "vibrators"} out!`)
                        removeVibe(vibeuser.id, vibetype)
                    }
                    else {
                        //User doesn't have a vibe of the same type or doesn't have any
                        interaction.reply({ content: `You don't have a ${vibetype ? vibetype : "vibrator"} on!`, flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    // User tries to modify another user's vibe settings
                    if (getVibe(vibeuser.id) && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)) || (!vibetype))) {
                        // User already has a vibrator of the same type on or type is null
                        interaction.reply(`${interaction.user} takes the ${vibetype ? vibetype : "vibrators"} out from ${vibeuser}!`)
                        removeVibe(vibeuser.id, vibetype)
                    }
                    else {
                        //User doesn't have a vibe of the same type or doesn't have any
                        interaction.reply({ content: `${vibeuser} does not have a ${vibetype ? vibetype : "vibrator"} on!`, flags: MessageFlags.Ephemeral })
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}