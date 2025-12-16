const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, assignChastity } = require('./../functions/vibefunctions.js')
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chastity')
		.setDescription('Put yourself in chastity, locking /vibe settings')
		.addUserOption(opt =>
			opt.setName('keyholder')
			.setDescription('Keyholder (leave blank to lock yourself)')
		),
        /*.addUserOption(opt =>
            opt.setName('collareduser')
            .setDescription("User with a collar whose unlocked or you have the key to")
        ),*/
    async execute(interaction) {
        try {
            let chastityuser = interaction.user
            let chastitykeyholder = interaction.options.getUser('keyholder')
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            // Check if the wearer is in an armbinder - if they are, block them. 
            if (getHeavy(interaction.user.id)) {
                if (getChastity(interaction.user.id)) {
                    interaction.reply(`${interaction.user} squirms in ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, trying to adjust ${getPronouns(interaction.user.id, "possessiveDeterminer")} chastity belt, but it's futile!`)
                }
                else {
                    // User is in some form of heavy bondage and cannot put on a chastity belt
                    interaction.reply(`${interaction.user} squirms in ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, trying to put on a chastity belt, but can't!`)
                }
            }
            else if (getChastity(interaction.user.id)?.keyholder) {
                if (getChastity(interaction.user.id)?.keyholder == interaction.user.id) {
                    // User tries to lock another belt on themselves and they hqave the key
                    interaction.reply({ content: `You are already locked in a chastity belt and you're holding the key!`, flags: MessageFlags.Ephemeral })
                }
                else {
                    // User tries to lock another belt on themselves and someone else has the key
                    interaction.reply({ content: `You are already locked in a chastity belt and <@${getChastity(interaction.user.id)?.keyholder} has the key!`, flags: MessageFlags.Ephemeral })
                }
            }
            else {
                if (chastitykeyholder) {
                    if (interaction.user != chastitykeyholder) {
                        // Locked it and giving someone else the key
                        interaction.reply(`${interaction.user} slips into a chastity belt, slipping on a tiny lock, and then hands ${chastitykeyholder} the key!`)
                        assignChastity(interaction.user.id, chastitykeyholder.id)
                    }
                    else {
                        // Locked it but holding onto the key
                        interaction.reply(`${interaction.user} puts a chastity belt on and clicks a tiny lock on it before stashing the key for safekeeping!`)
                        assignChastity(interaction.user.id, chastitykeyholder.id)
                    }
                }
                else {
                    // Left it unlocked
                    interaction.reply(`${interaction.user} puts a chastity belt on and clicks a tiny lock on it before stashing the key for safekeeping!`)
                    assignChastity(interaction.user.id, interaction.user.id)
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}