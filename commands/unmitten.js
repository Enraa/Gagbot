const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMitten, deleteMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmitten')
		.setDescription(`Take someone else's mittens off`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to free from their mittens')
		),
    async execute(interaction) {
		try {
			let mitteneduser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			if (getHeavy(interaction.user.id)) {
				if (interaction.options.getUser('user') == interaction.user) {
					interaction.reply(`${interaction.user} wriggles ${getPronouns(mitteneduser.id, "possessiveDeterminer")} hands in their ${getHeavy(interaction.user.id).type}, but can't get good leverage to take ${getPronouns(mitteneduser.id, "possessiveDeterminer")} mittens off!`)
				}
				else {
					interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} nose because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, but can't help ${mitteneduser} out of ${getPronouns(mitteneduser.id, "possessiveDeterminer")} mittens!`)
				}
			}
			else if (getMitten(mitteneduser.id)) {
				if (mitteneduser != interaction.user) {
					interaction.reply(`${interaction.user} takes off ${mitteneduser}'s mittens so ${getPronouns(mitteneduser.id, "subject")} can take off ${getPronouns(mitteneduser.id, "possessiveDeterminer")} gag!`)
					deleteMitten(mitteneduser.id)
				}
				else {
					interaction.reply(`${interaction.user} tries to pull off ${getPronouns(mitteneduser.id, "possessiveDeterminer")} mittens, but the straps and locks hold them firmly on ${getPronouns(mitteneduser.id, "possessiveDeterminer")} wrists!`)
				}
			}
			else {
				interaction.reply({ content: `${mitteneduser} is not wearing mittens!`, flags: MessageFlags.Ephemeral })
			}
		}
		catch (err) {
			console.log(err)
		}
    }
}