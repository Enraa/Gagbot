const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy, removeHeavy, convertheavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unheavy')
        .setDescription(`Free someone else from their heavy bondage`)
        .addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to free from their predicament...')
		),
    async execute(interaction) {
        try {
            let heavyuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            if (getHeavy(interaction.user.id)) {
                if (interaction.user == heavyuser) {
                    interaction.reply(`${interaction.user} wiggles in ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, but obviously ${getPronouns(interaction.user.id, "subjectIs")} *very* helpless and can't get far with taking it off on ${getPronouns(interaction.user.id, "possessiveDeterminer")} own!`)
                }
                else {
                    interaction.reply(`${interaction.user} wiggles in ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, wanting to help ${heavyuser} out, but can't with ${getPronouns(interaction.user.id, "possessiveDeterminer")} useless arms and hands!`)
                }
            }
            else {
                if (getHeavy(heavyuser.id)) {
                    interaction.reply(`${interaction.user} helps ${heavyuser} out of ${getPronouns(heavyuser.id, "possessiveDeterminer")} ${getHeavy(heavyuser.id).type}! ${getPronouns(heavyuser.id, "subject", true)} stretch${getPronouns(heavyuser.id, "subject") != "they" ? "es" : ""} ${getPronouns(heavyuser.id, "possessiveDeterminer")} arms and sigh${getPronouns(heavyuser.id, "subject") != "they" ? "s" : ""} with gratitude!`)
                    removeHeavy(heavyuser.id)
                }
                else {
                    if (heavyuser == interaction.user) {
                        interaction.reply({ content: `You aren't in any kind of heavy bondage!`, flags: MessageFlags.Ephemeral })
                    }
                    else {
                        interaction.reply({ content: `${heavyuser} is not in any kind of heavy bondage!`, flags: MessageFlags.Ephemeral })
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}