const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMittenName, getMitten, getGag, convertGagText, getGagIntensity } = require('./../functions/gagfunctions.js')
const { getChastity, getVibe, getChastityKeys, getChastityTimelock, getArousalDescription, getArousalChangeDescription } = require('./../functions/vibefunctions.js')
const { getCollar, getCollarPerm, getCollarKeys } = require('./../functions/collarfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getCorset } = require('./../functions/corsetfunctions.js')
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
            if (getGag(inspectuser.id)) {
                outtext = `${outtext}<:Gag:1073495437635506216> Gag: **${convertGagText(getGag(inspectuser.id))}** set to Intensity **${getGagIntensity(inspectuser.id)}**\n`
            }
            else {
                outtext = `${outtext}<:Gag:1073495437635506216> Gag: Not currently worn.\n`
            }
            // Mitten status
            if (getMitten(inspectuser.id)) {
                if (getMittenName(inspectuser.id)) {
                    outtext = `${outtext}<:mittens:1452425463757803783> Mittens: **${getMittenName(inspectuser.id)}**\n`
                }
                else {
                    outtext = `${outtext}<:mittens:1452425463757803783> Mittens: **WORN**\n`
                }
            }
            else {
                outtext = `${outtext}<:mittens:1452425463757803783> Mittens: Not currently worn.\n`
            }
            // Vibe status
            if (getVibe(inspectuser.id)) {
                outtext = `${outtext}<:MagicWand:1073504682540011520> Vibrators/toys: **${getVibe(inspectuser.id).map(vibe => `${vibe.vibetype} (${vibe.intensity})`).join(', ')}**\n`
            }
            else {
                outtext = `${outtext}<:MagicWand:1073504682540011520> Vibrator: Not currently worn.\n`
            }
            // Arousal status
            const arousal = getArousalDescription(inspectuser.id);
            if (arousal) outtext = `${outtext}Arousal: **${getArousalDescription(inspectuser.id)}**\n`;
            const change = getArousalChangeDescription(inspectuser.id);
            if (change) outtext = `${outtext}-# ...${change}\n`;
            // Chastity status
            if (getChastity(inspectuser.id)) {
                let isLocked = (getChastity(inspectuser.id)?.keyholder == interaction.user.id || (getChastity(inspectuser.id)?.access === 0 && inspectuser.id != interaction.user.id))
                let lockemoji = isLocked ? "🔑" : "🔒"
                let chastitykeyaccess = getChastity(inspectuser.id)?.access
                let timelockedtext = "Timelocked (Open)"
                if (chastitykeyaccess == 1) { timelockedtext = "Timelocked (Keyed)" }
                if (chastitykeyaccess == 2) { timelockedtext = "Timelocked (Sealed)" }
                if (getChastity(inspectuser.id).keyholder == "discarded") {
                    outtext = `${outtext}<:Chastity:1073495208861380629> Chastity: ${lockemoji} **Keys are Missing!**\n`
                }
                else if (getChastityTimelock(inspectuser.id)) {
                    outtext = `${outtext}<:Chastity:1073495208861380629> Chastity: ${lockemoji} **${timelockedtext} until ${getChastityTimelock(inspectuser.id, true)}**\n`
                }
                else if (getChastity(inspectuser.id).keyholder == inspectuser.id) {
                    // Self bound!
                    outtext = `${outtext}<:Chastity:1073495208861380629> Chastity: ${lockemoji} **Self-bound!**\n`
                }
                else {
                    outtext = `${outtext}<:Chastity:1073495208861380629> Chastity: ${lockemoji} **Key held by <@${getChastity(inspectuser.id).keyholder}>**\n`
                }
            }
            else {
                outtext = `${outtext}<:Chastity:1073495208861380629> Chastity: Not currently worn.\n`
            }
            // Corset status
            if (getCorset(inspectuser.id)) {
                if (getCorset(inspectuser.id).tightness > 7) {
                    outtext = `${outtext}<:corset:1451126998192881684> Corset: **Laced tightly to a string length of ${getCorset(inspectuser.id).tightness}**\n`
                }
                else if (getCorset(inspectuser.id).tightness > 4) {
                    outtext = `${outtext}<:corset:1451126998192881684> Corset: **Laced moderately to a string length of ${getCorset(inspectuser.id).tightness}**\n`
                }
                else {
                    outtext = `${outtext}<:corset:1451126998192881684> Corset: **Laced loosely to a string length of ${getCorset(inspectuser.id).tightness}**\n`
                }
            }
            else {
                outtext = `${outtext}<:corset:1451126998192881684> Corset: Not currently worn.\n`
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
                if (getCollar(inspectuser.id).keyholder == "discarded") {
                    // Self bound!
                    if (getCollar(inspectuser.id).keyholder_only) {
                        outtext = `${outtext}<:collar:1449984183261986939> Collar: **Keys are Missing!**\n`
                    }
                    else {
                        outtext = `${outtext}<:collar:1449984183261986939> Collar: **Keys are Missing! Free Use!**\n`
                    }
                }
                else if (!getCollar(inspectuser.id).keyholder_only) {
                    // Free use!
                    if (getCollar(inspectuser.id).keyholder == inspectuser.id) {
                        outtext = `${outtext}<:collar:1449984183261986939> Collar: **Self-bound and free use!**\n`
                    }
                    else {
                        outtext = `${outtext}<:collar:1449984183261986939> Collar: **Key held by <@${getCollar(inspectuser.id).keyholder}>, free use!**\n`
                    }
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