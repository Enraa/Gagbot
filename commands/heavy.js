const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy, assignHeavy, commandsheavy, convertheavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('heavy')
        .setDescription(`Put heavy bondage on, preventing the use of any command`)
        .addStringOption(opt =>
			opt.setName('type')
			.setDescription('What flavor of helpless restraint to wear...')
			.addChoices(...commandsheavy)
		),
    async execute(interaction) {
        try {
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            let heavychoice = interaction.options.getString('type') ? interaction.options.getString('type') : "armbinder_latex"
            if (getHeavy(interaction.user.id)) {
                interaction.reply(`${interaction.user} writhes in ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, trying to change ${getPronouns(interaction.user.id, "possessiveDeterminer")} bondage, but may need some help!`)
            }
            else {
                interaction.reply(`${interaction.user} slips into a ${convertheavy(heavychoice)}, rendering ${getPronouns(interaction.user.id, "possessiveDeterminer")} arms and hands completely useless!`)
                assignHeavy(interaction.user.id, heavychoice)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}