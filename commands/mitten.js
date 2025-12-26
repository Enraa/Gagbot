const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getGag, assignMitten, getMitten } = require('./../functions/gagfunctions.js')
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getText } = require("./../functions/textfunctions.js");

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

            // Build data tree:
            let data = {
                textarray: "texts_mitten",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: interaction.user,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                }
            }

            if (getHeavy(interaction.user.id)) {
                data.heavy = true
                interaction.reply(getText(data))
            }
            else if (getMitten(interaction.user.id)) {
                data.mitten = true
                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
            }
            else {
                // Not mittened
                data.nomitten = true
                if (getGag(interaction.user.id)) {
                    // Wearing a gag already. 
                    data.gag = true
                    interaction.reply(getText(data))
                    assignMitten(interaction.user.id);
                }
                else {
                    // Not wearing a gag
                    data.nogag = true
                    interaction.reply(getText(data))
                    assignMitten(interaction.user.id);
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}