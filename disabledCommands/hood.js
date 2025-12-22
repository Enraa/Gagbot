const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMitten, deleteMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hood')
		.setDescription(`Apply headwear to someone. . .`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to apply headwear to?')
		)
        .addStringOption(opt =>
			opt.setName('type')
			.setDescription('What headwear to wear...')
			.addChoices(...commandsheavy)
		),
    async execute(interaction) {
		try {
			let hooduser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
			let hoodchoice = interaction.options.getString('type') ? interaction.options.getString('type') : "Latex Hood with Eyeholes"
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			if (getWornHoods(hooduser).includes(hoodchoice)) {
				if (hooduser == interaction.user) {
					interaction.reply({ content: `You are already wearing a ${hoodchoice}!`, flags: MessageFlags.Ephemeral });
					return;
				}
				else {
					interaction.reply({ content: `${hooduser} is already wearing a ${hoodchoice}!`, flags: MessageFlags.Ephemeral });
					return;
				}
			}
			// Block the headgear from being put on if wearing heavy bondage. 
			if (getHeavy(interaction.user.id)) {
				if (interaction.options.getUser('user') == interaction.user) {
					interaction.reply(`${interaction.user} taps a ${hoodchoice} while wearing ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, but it's really difficult to fanagle it onto their head while their arms are so secure!`)
				}
				else {
					interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} shoulder to try to put a ${hoodchoice} on ${hooduser}, but clearly putting things on ${getPronouns(hooduser, "object")} while ${getPronouns(interaction.user.id, "subject")} ${getPronouns(interaction.user.id, "subject") != "they" ? "is" : "are"} in a ${getHeavy(interaction.user.id).type} isn't ${getPronouns(interaction.user.id, "possessiveDeterminer")} strong suit!`)
				}
			}
			// Block the headgear from being put on if wearing mittens. 
			else if (getMitten(interaction.user.id)) {
				if (interaction.options.getUser('user') == interaction.user) {
					interaction.reply(`${interaction.user} taps a ${hoodchoice} while wearing ${getPronouns(interaction.user.id, "possessiveDeterminer")} mittens, but not having fingers makes it really hard to put a ${hoodchoice} on ${getPronouns(interaction.user.id, "possessiveDeterminer")} head!`)
				}
				else {
					interaction.reply(`${interaction.user} uses ${getPronouns(interaction.user.id, "possessiveDeterminer")} shoulder to try to put a ${headchoice} on ${hooduser}, but clearly putting things on ${getPronouns(hooduser, "object")} while ${getPronouns(interaction.user.id, "subject")} ${getPronouns(interaction.user.id, "subject") != "they" ? "is" : "are"} in a ${getHeavy(interaction.user.id).type} isn't ${getPronouns(interaction.user.id, "possessiveDeterminer")} strong suit!`)
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