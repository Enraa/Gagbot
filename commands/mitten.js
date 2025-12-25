const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { assignMitten, getMitten } = require('./../functions/gagfunctions.js')
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mitten')
		.setDescription('Put mittens on yourself, preventing /ungag on yourself and /gag on others'),
    async execute(interaction) {
        try {
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            if (getHeavy(interaction.user.id)) {
                interaction.reply(`${interaction.user} nuzzles a pair of mittens, but can't put them on because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}.`)
            }
            else if (getMitten(interaction.user.id)) {
                interaction.reply({ content: `You are already wearing mittens!`, flags: MessageFlags.Ephemeral })
            }
            else {
                assignMitten(interaction.user.id);
                interaction.reply(`${interaction.user} puts on a pair of mittens with a pair of padlocks. ${getPronouns(interaction.user.id, "subjectWill", true)} be unable to remove ${getPronouns(interaction.user.id, "possessiveDeterminer")} gag!`)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}