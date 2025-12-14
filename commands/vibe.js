const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, getVibe, assignVibe } = require('./../functions/vibefunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
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
		.setName('vibe')
		.setDescription('Add a vibrator, causing stuttered speech and other effects')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('Who to add a fun vibrator to')
        )
        .addStringOption(opt =>
            opt.setName('type')
            .setDescription('What kind of vibe to add')
            .addChoices(...vibetypes)
        )
		.addNumberOption(opt => 
            opt.setName('intensity')
            .setDescription("How intensely to stimulate")
            .setMinValue(1)
            .setMaxValue(10)
        ),
    async execute(interaction) {
        let vibeuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
		let vibeintensity = interaction.options.getNumber('intensity') ? interaction.options.getNumber('intensity') : 5
        let vibetype = interaction.options.getString('type') ? interaction.options.getString('type') : "bullet"

        if (getHeavy(interaction.user.id)) {
            if (vibeuser == interaction.user) {
                if (getChastity(vibeuser.id)) {
                    interaction.reply(`${interaction.user} bats around a vibrator despite their ${getHeavy(interaction.user.id).type}, but they can't insert it because of their chastity belt! And well, they don't have arms!`)
                }
                else {
                    interaction.reply(`${interaction.user} stares at a vibrator, longing to feel its wonderful vibrations, but sighing in frustration because they are in a ${getHeavy(interaction.user.id).type} and can't put it on!`)
                }
            }
            else {
                if (getChastity(vibeuser.id)) {
                    interaction.reply(`${interaction.user} uses their chin to move a vibrator towards ${vibeuser} before realizing they can't put it on them because of their ${getHeavy(interaction.user.id).type} and ${vibeuser}'s chastity belt!`)
                }
                else {
                    interaction.reply(`${interaction.user} rubs their cheek on the vibrator, trying to move it and put it on ${vibeuser}. It's a shame they don't have arms because of their ${getHeavy(interaction.user.id).type}!`)
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
                        interaction.reply(`${interaction.user} unlocks their belt, changing the vibrator setting to ${vibeintensity} and then locks it back up!`)
                        assignVibe(vibeuser.id, vibeintensity, vibetype)
                    }
                    else {
                        interaction.reply(`${interaction.user} unlocks their belt, adding a vibrator set to ${vibeintensity} and then locks it back up!`)
                        assignVibe(vibeuser.id, vibeintensity, vibetype)
                    }
                }
                else {
                    // User tries to modify another user's vibe settings
                    if (getVibe(vibeuser.id)) {
                        // User already has a vibrator on
                        interaction.reply(`${interaction.user} unlocks ${vibeuser}'s belt, changing the vibrator setting to ${vibeintensity} and then locks it back up!`)
                        assignVibe(vibeuser.id, vibeintensity, vibetype)
                    }
                    else {
                        interaction.reply(`${interaction.user} unlocks ${vibeuser}'s belt, adding a vibrator set to ${vibeintensity} and then locks it back up!`)
                        assignVibe(vibeuser.id, vibeintensity, vibetype)
                    }
                }
            }
            else {
                // User tries to modify vibe settings but does not have the key for the belt
                if (vibeuser == interaction.user) {
                    // User tries to modify their own vibe settings while in chastity
                    if (getVibe(vibeuser.id)) {
                        // User already has a vibrator on
                        interaction.reply(`${interaction.user} claws at their belt, feverishly trying to change the vibrator settings, but can't!`)
                    }
                    else {
                        interaction.reply(`${interaction.user} runs their fingers on their belt, trying to turn on a vibrator, but can't!`)
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
                    interaction.reply(`${interaction.user} changes their vibrator setting to ${vibeintensity}!`)
                    assignVibe(vibeuser.id, vibeintensity, vibetype)
                }
                else {
                    interaction.reply(`${interaction.user} slips on a vibrator set to ${vibeintensity}!`)
                    assignVibe(vibeuser.id, vibeintensity, vibetype)
                }
            }
            else {
                // User tries to modify another user's vibe settings
                if (getVibe(vibeuser.id)) {
                    // User already has a vibrator on
                    interaction.reply(`${interaction.user} changes ${vibeuser}'s vibrator to ${vibeintensity}!`)
                    assignVibe(vibeuser.id, vibeintensity, vibetype)
                }
                else {
                    interaction.reply(`${interaction.user} slips a vibrator on ${vibeuser} set to ${vibeintensity}!`)
                    assignVibe(vibeuser.id, vibeintensity, vibetype)
                }
            }
        }
    }
}