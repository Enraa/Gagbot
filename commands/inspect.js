const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMitten, getGag, convertGagText, getGagIntensity } = require('./../functions/gagfunctions.js')
const { getChastity, getVibe, getChastityKeys } = require('./../functions/vibefunctions.js')
const { getCollar, getCollarPerm, getCollarKeys } = require('./../functions/collarfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns, getPronounsSet } = require('./../functions/pronounfunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inspect')
		.setDescription(`Inspect someone's restraints if they are wearing any`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to inspect (blank to inspect yourself)')
		),
    async execute(interaction) {
        try {
            let inspectuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;
            let outtext = ``
            if (inspectuser == interaction.user) {
                outtext = `## Your current restraints:\n-# (${getPronounsSet(interaction.user.id)})\n`
            }
            else {
                outtext = `## ${inspectuser}'s current restraints:\n-# (${getPronounsSet(inspectuser.id)})\n`
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
                outtext = `${outtext}<:MagicWand:1073504682540011520> Vibrators/toys: **${getVibe(inspectuser.id).map(vibe => `${vibe.vibetype} (${vibe.intensity})`).join(', ')}**\n`
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
            // Collar status
            if (getCollar(inspectuser.id)) {
                if (!getCollar(inspectuser.id).keyholder_only) {
                    // Free use!
                    outtext = `${outtext}<:collar:1449984183261986939> Collar: **Unlocked and free use!**\n`
                }
                else if (getCollar(inspectuser.id).keyholder == inspectuser.id) {
                    // Self bound!
                    outtext = `${outtext}<:collar:1449984183261986939> Collar: **Self-bound!**\n`
                }
                else {
                    outtext = `${outtext}<:collar:1449984183261986939> Collar: **Key held by <@${getCollar(inspectuser.id).keyholder}>**\n`
                }
                // Output Collar Perms
                outtext = `${outtext}-# Mittens: ${getCollarPerm(inspectuser.id, "mitten") ? "YES":"NO"}, Chastity: ${getCollarPerm(inspectuser.id, "chastity") ? "YES":"NO"}, Heavy: ${getCollarPerm(inspectuser.id, "heavy") ? "YES":"NO"}\n`
            }
            else {
                outtext = `${outtext}<:collar:1449984183261986939> Collar: Not currently worn.\n`
            }
            outtext = `${outtext}\n`
            let keysheldchastity = getChastityKeys(inspectuser.id)
            if (keysheldchastity.length > 0) {
                keysheldchastity = keysheldchastity.map(k => `<@${k}>`)
                let keysstring = keysheldchastity.join(", ");
                outtext = `${outtext}Currently holding chastity keys for: ${keysstring}\n`
            }
            let keysheldcollar = getCollarKeys(inspectuser.id)
            if (keysheldcollar.length > 0) {
                keysheldcollar = keysheldcollar.map(k => `<@${k}>`)
                let keysstring = keysheldcollar.join(", ");
                outtext = `${outtext}Currently holding collar keys for: ${keysstring}`
            }
            interaction.reply({ content: outtext, flags: MessageFlags.Ephemeral })
        }
        catch (err) {
            console.log(err)
        }
    }
}