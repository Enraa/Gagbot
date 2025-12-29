const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMittenName, getMitten, getGag, convertGagText, getGagIntensity } = require('./../functions/gagfunctions.js')
const { getChastity, getVibe, getChastityKeys, getChastityTimelock, getArousalDescription, getArousalChangeDescription, getChastityName } = require('./../functions/vibefunctions.js')
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
            let inspectparts = [];
            let titletext = ``
            let outtext = ``
            if (inspectuser == interaction.user) {
                titletext = `## Your current restraints:\n-# (${getPronounsSet(interaction.user.id)})\n\n`
            }
            else {
                titletext = `## ${inspectuser}'s current restraints:\n-# (${getPronounsSet(inspectuser.id)})\n\n`
            }
            // Gag status
            if (getGag(inspectuser.id)) {
                inspectparts.push(`<:Gag:1073495437635506216> Gag: **${convertGagText(getGag(inspectuser.id))}** set to Intensity **${getGagIntensity(inspectuser.id)}**`)
            }
            else {
                inspectparts.push(`<:Gag:1073495437635506216> Gag: Not currently worn.`)
            }
            // Mitten status
            if (getMitten(inspectuser.id)) {
                if (getMittenName(inspectuser.id)) {
                    inspectparts.push(`<:mittens:1452425463757803783> Mittens: **${getMittenName(inspectuser.id)}**`)
                }
                else {
                    inspectparts.push(`<:mittens:1452425463757803783> Mittens: **WORN**`)
                }
            }
            else {
                inspectparts.push(`<:mittens:1452425463757803783> Mittens: Not currently worn.`)
            }
            // Vibe status
            if (getVibe(inspectuser.id)) {
                inspectparts.push(`<:MagicWand:1073504682540011520> Vibrators/toys: **${getVibe(inspectuser.id).map(vibe => `${vibe.vibetype} (${vibe.intensity})`).join(', ')}**`)
            }
            else {
                inspectparts.push(`<:MagicWand:1073504682540011520> Vibrator: Not currently worn.`)
            }
            // Arousal status
            let arousalblock = ``
            const arousal = getArousalDescription(inspectuser.id);
            if (arousal) arousalblock = `Arousal: **${getArousalDescription(inspectuser.id)}**`;
            const change = getArousalChangeDescription(inspectuser.id);
            if (change) arousalblock = `${arousalblock}\n-# ...${change}`;
            if (arousalblock.length > 0) { inspectparts.push(arousalblock) }
            // Chastity status
            if (getChastity(inspectuser.id)) {
                let isLocked = (getChastity(inspectuser.id)?.keyholder == interaction.user.id || (getChastity(inspectuser.id)?.access === 0 && inspectuser.id != interaction.user.id))
                let lockemoji = isLocked ? "🔑" : "🔒"
                let chastitykeyaccess = getChastity(inspectuser.id)?.access
                let currentchastitybelt = (getChastityName(inspectuser.id) ? getChastityName(inspectuser.id) : "Locked Up Nice and Tight!")
                let timelockedtext = "Timelocked (Open)"
                if (chastitykeyaccess == 1) { timelockedtext = "Timelocked (Keyed)" }
                if (chastitykeyaccess == 2) { timelockedtext = "Timelocked (Sealed)" }
                if (getChastity(inspectuser.id).keyholder == "discarded") {
                    inspectparts.push(`<:Chastity:1073495208861380629> Chastity: **${currentchastitybelt}**\n-# ‎   ⤷ ${lockemoji} **Keys are Missing!**`)
                }
                else if (getChastityTimelock(inspectuser.id)) {
                    inspectparts.push(`<:Chastity:1073495208861380629> Chastity: **${currentchastitybelt}**\n-# ‎   ⤷ ${lockemoji} **${timelockedtext} until ${getChastityTimelock(inspectuser.id, true)}**`)
                }
                else if (getChastity(inspectuser.id).keyholder == inspectuser.id) {
                    // Self bound!
                    inspectparts.push(`<:Chastity:1073495208861380629> Chastity: **${currentchastitybelt}**\n-# ‎   ⤷ ${lockemoji} **Self-bound!**`)
                }
                else {
                    inspectparts.push(`<:Chastity:1073495208861380629> Chastity: **${currentchastitybelt}**\n-# ‎   ⤷ ${lockemoji} **Key held by <@${getChastity(inspectuser.id).keyholder}>**`)
                }
            }
            else {
                inspectparts.push(`<:Chastity:1073495208861380629> Chastity: Not currently worn.`)
            }
            // Corset status
            if (getCorset(inspectuser.id)) {
                if (getCorset(inspectuser.id).tightness > 10) {
                    inspectparts.push(`<:corset:1451126998192881684> Corset: **Laced beyond reason to a string length of ${getCorset(inspectuser.id).tightness}**`)
                }
                else if (getCorset(inspectuser.id).tightness > 7) {
                    inspectparts.push(`<:corset:1451126998192881684> Corset: **Laced tightly to a string length of ${getCorset(inspectuser.id).tightness}**`)
                }
                else if (getCorset(inspectuser.id).tightness > 4) {
                    inspectparts.push(`<:corset:1451126998192881684> Corset: **Laced moderately to a string length of ${getCorset(inspectuser.id).tightness}**`)
                }
                else {
                    inspectparts.push(`<:corset:1451126998192881684> Corset: **Laced loosely to a string length of ${getCorset(inspectuser.id).tightness}**`)
                }
            }
            else {
                inspectparts.push(`<:corset:1451126998192881684> Corset: Not currently worn.`)
            }
            // Heavy Bondage status
            if (getHeavy(inspectuser.id)) {
                inspectparts.push(`<:Armbinder:1073495590656286760> Heavy Bondage: **${getHeavy(inspectuser.id).type}**`)
            }
            else {
                inspectparts.push(`<:Armbinder:1073495590656286760> Heavy Bondage: Not currently worn.`)
            }
            // Collar status
            let collarparts = []
            if (getCollar(inspectuser.id)) {
                let currentcollartext = "Locked Up Nice and Tight!"
                let isLocked = ((getCollar(inspectuser.id).keyholder == interaction.user) || (!getCollar(inspectuser.id).keyholder_only))
                let lockemoji = isLocked ? "🔑" : "🔒"
                if (getCollar(inspectuser.id).keyholder == "discarded") {
                    // Self bound!
                    if (getCollar(inspectuser.id).keyholder_only) {
                        collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Keys are Missing!**`)
                    }
                    else {
                        collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Keys are Missing! Free Use!**`)
                    }
                }
                else if (!getCollar(inspectuser.id).keyholder_only) {
                    // Free use!
                    if (getCollar(inspectuser.id).keyholder == inspectuser.id) {
                        collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Self-bound and free use!**`)
                    }
                    else {
                        collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Key held by <@${getCollar(inspectuser.id).keyholder}>, free use!**`)
                    }
                }
                else if (getCollar(inspectuser.id).keyholder == inspectuser.id) {
                    // Self bound!
                    collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Self-bound!**`)
                }
                else {
                    collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Key held by <@${getCollar(inspectuser.id).keyholder}>**`)
                }
                // Output Collar Perms
                collarparts.push(`-# Mittens: ${getCollarPerm(inspectuser.id, "mitten") ? "YES":"NO"}, Chastity: ${getCollarPerm(inspectuser.id, "chastity") ? "YES":"NO"}, Heavy: ${getCollarPerm(inspectuser.id, "heavy") ? "YES":"NO"}`)
            }
            else {
                collarparts.push(`<:collar:1449984183261986939> Collar: Not currently worn.`)
            }
            inspectparts.push(collarparts.join("\n"));
            inspectparts.push(" ")
            // Keys Held
            let keysheldtext = ''
            let keysheldchastity = getChastityKeys(inspectuser.id)
            if (keysheldchastity.length > 0) {
                keysheldchastity = keysheldchastity.map(k => `<@${k}>`)
                let keysstring = keysheldchastity.join(", ");
                keysheldtext = `Currently holding chastity keys for: ${keysstring}\n`
            }
            let keysheldcollar = getCollarKeys(inspectuser.id)
            if (keysheldcollar.length > 0) {
                keysheldcollar = keysheldcollar.map(k => `<@${k}>`)
                let keysstring = keysheldcollar.join(", ");
                keysheldtext = `${keysheldtext}Currently holding collar keys for: ${keysstring}`
            }
            if (keysheldtext.length > 0) { inspectparts.push(keysheldtext) }

            // Now construct the pages - we want pages of 1000 characters or fewer. If a part causes a page to exceed that,
            // we want to use a new page button eventually to handle this. 
            outtext = `${titletext}${inspectparts.join("\n")}`
            interaction.reply({ content: outtext, flags: MessageFlags.Ephemeral })
        }
        catch (err) {
            console.log(err)
        }
    }
}