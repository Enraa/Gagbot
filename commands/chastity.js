const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, assignChastity } = require('./../functions/vibefunctions.js')
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getText } = require("./../functions/textfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chastity')
		.setDescription('Put yourself in chastity, locking /vibe settings')
		.addUserOption(opt =>
			opt.setName('keyholder')
			.setDescription('Keyholder (leave blank to lock yourself)')
		),
    async execute(interaction) {
        try {
            let chastityuser = interaction.user
            let chastitykeyholder = interaction.options.getUser('keyholder') ? interaction.options.getUser('keyholder') : interaction.user
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }

            // Build data tree:
            let data = {
                textarray: "texts_chastity",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: chastitykeyholder,
                    c1: getHeavy(interaction.user.id)?.type // heavy bondage type 
                }
            }

            // Check if the wearer is in an armbinder - if they are, block them. 
            if (getHeavy(interaction.user.id)) {
                data.heavy = true
                if (getChastity(interaction.user.id)) {
                    // User is in some form of heavy bondage and already has a chastity belt
                    data.chastity = true
                    interaction.reply(getText(data))
                }
                else {
                    // User is in some form of heavy bondage and cannot put on a chastity belt
                    data.nochastity = true
                    interaction.reply(getText(data))
                }
            }
            else if (getChastity(interaction.user.id)?.keyholder) {
                data.noheavy = true
                data.chastity = true
                if (getChastity(interaction.user.id)?.keyholder == interaction.user.id) {
                    // User tries to lock another belt on themselves and they have the key
                    data.key_self = true
                    interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                }
                else {
                    // User tries to lock another belt on themselves and someone else has the key
                    data.key_other = true
                    interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                }
            }
            else {
                data.noheavy = true
                data.nochastity = true
                if (chastitykeyholder) {
                    if (interaction.user != chastitykeyholder) {
                        // Locked it and giving someone else the key
                        data.key_other = true
                        interaction.reply(getText(data))
                        assignChastity(interaction.user.id, chastitykeyholder.id)
                    }
                    else {
                        // Locked it but holding onto the key
                        data.key_self = true
                        interaction.reply(getText(data))
                        assignChastity(interaction.user.id, chastitykeyholder.id)
                    }
                }
                else {
                    // Left it unlocked ---- This is currently an unused data path as there will ALWAYS be a keyholder. 
                    interaction.reply(`${interaction.user} puts a chastity belt on and clicks a tiny lock on it before stashing the key for safekeeping!`)
                    assignChastity(interaction.user.id, interaction.user.id)
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}