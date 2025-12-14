const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMitten, getGag, convertGagText, getGagIntensity } = require('./../functions/gagfunctions.js')
const { getChastity, getVibe } = require('./../functions/vibefunctions.js')
const { getCollar } = require('./../functions/collarfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inspect')
		.setDescription(`Inspect someone's restraints if they are wearing any`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to inspect (blank to inspect yourself)')
		),
    async execute(interaction) {
		let inspectuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
        let outtext = ``
        if (inspectuser == interaction.user) {
            outtext = '## Your current restraints:\n'
        }
        else {
            outtext = `## ${inspectuser}'s current restraints:\n`
        }
        // Gag status
        if (getGag(inspectuser)) {
            outtext = `${outtext}<:Gag:1073495437635506216> Gag: **${convertGagText(getGag(inspectuser))}** set to Intensity **${getGagIntensity(inspectuser)}**\n`
        }
        else {
            outtext = `${outtext}<:Gag:1073495437635506216> Gag: Not currently worn.\n`
        }
        // Mitten status
        if (getMitten(inspectuser)) {
            outtext = `${outtext}<:Hand:1098086504598884402> Mittens: **WORN**\n`
        }
        else {
            outtext = `${outtext}<:Hand:1098086504598884402> Mittens: Not currently worn.\n`
        }
        // Vibe status
        if (getVibe(inspectuser.id)) {
            outtext = `${outtext}<:MagicWand:1073504682540011520> Vibrator: **${getVibe(inspectuser.id).vibetype}** **Set to Speed ${getVibe(inspectuser.id).intensity}**\n`
        }
        else {
            outtext = `${outtext}<:MagicWand:1073504682540011520> Vibrator: Not currently worn.\n`
        }
        // Chastity status
        if (getChastity(inspectuser.id)) {
            if (getChastity(inspectuser.id).keyholder == inspectuser.id) {
                // Self bound!
                outtext = `${outtext}<:Chastity:1073495208861380629> Chastity: **Self-bound!**\n`
            }
            else {
                outtext = `${outtext}<:Chastity:1073495208861380629> Chastity: **Key held by <@${getChastity(inspectuser.id).keyholder}>**\n`
            }
        }
        else {
            outtext = `${outtext}<:Chastity:1073495208861380629> Chastity: Not currently worn.\n`
        }
        // Heavy Bondage status
        if (getHeavy(inspectuser.id)) {
            outtext = `${outtext}<:Armbinder:1073495590656286760> Heavy Bondage: **${getHeavy(inspectuser.id).type}**\n`
        }
        else {
            outtext = `${outtext}<:Armbinder:1073495590656286760> Heavy Bondage: Not currently worn.\n`
        }
        interaction.reply({ content: outtext, flags: MessageFlags.Ephemeral })
    }
}