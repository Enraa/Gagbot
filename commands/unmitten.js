const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getGag, getMitten, deleteMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getText } = require("./../functions/textfunctions.js");

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
			let data = {
                textarray: "texts_unmitten",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: mitteneduser,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                }
            }
			if (getHeavy(interaction.user.id)) {
				data.heavy = true
				if (interaction.options.getUser('user') == interaction.user) {
					data.self = true
					interaction.reply(getText(data))
				}
				else {
					data.other = true
					interaction.reply(getText(data))
				}
			}
			else if (getMitten(mitteneduser.id)) {
				data.noheavy = true
				if (mitteneduser != interaction.user) {
					data.other = true
					if (getGag(mitteneduser.id)) {
						data.gag = true
						interaction.reply(getText(data))
						deleteMitten(mitteneduser.id)
					}
					else {
						data.nogag = true
						interaction.reply(getText(data))
						deleteMitten(mitteneduser.id)
					}
				}
				else {
					data.self = true
					interaction.reply(getText(data))
				}
			}
			else {
				data.otherother = true
				interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
			}
		}
		catch (err) {
			console.log(err)
		}
    }
}