const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, removeChastity, discardChastityKey } = require('./../functions/vibefunctions.js')
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js');
const { optins } = require('../functions/optinfunctions.js');
const { rollKeyFumbleN } = require('../functions/keyfindingfunctions.js');
const { getText } = require("./../functions/textfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unchastity')
		.setDescription('Remove a chastity belt from someone')
		.addUserOption(opt =>
			opt.setName('wearer')
			.setDescription('Who to unlock...')
		),
    async execute(interaction) {
        try {
            let chastitywearer = interaction.options.getUser('wearer') ? interaction.options.getUser('wearer') : interaction.user
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            // Build data tree:
            let data = {
                textarray: "texts_unchastity",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: chastitywearer,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                }
            }
            if (getHeavy(interaction.user.id)) {
                // In heavy bondage, cannot take off the belt anyway
                data.heavy = true
                if (chastitywearer == interaction.user) {
                    // trying to take off own belt
                    data.self = true
                    if (getChastity(interaction.user.id)) {
                        // in chastity
                        data.chastity = true
                        interaction.reply(getText(data))
                    }
                    else {
                        // User is in some form of heavy bondage and wouldn't be able to remove it anyway
                        data.nochastity = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    data.other = true
                    if (getChastity(interaction.user.id)) {
                        data.chastity = true
                        interaction.reply(getText(data))
                    }
                    else {
                        // User is in some form of heavy bondage and cannot put on a chastity belt
                        data.nochastity = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
            }
            // What the fuck was my logic here
            // Anyway, rewritten unchastity logic
            else {
                // Not in heavy bondage
                data.noheavy = true
                if (chastitywearer == interaction.user) {
                    // This is ourselves
                    data.self = true
                    if (getChastity(chastitywearer.id)) {
                        // We are in chastity
                        data.chastity = true
                        if (getChastity(chastitywearer.id).keyholder == interaction.user.id) {
                            // We have the key to our belt
                            data.key = true
                            const fumbleResults = rollKeyFumbleN(interaction.user.id, chastitywearer.id, 2);
                            if (fumbleResults[0]) {
                                // We fumbled
                                data.fumble = true
                                if (optins.getKeyDiscarding(chastitywearer.id) && fumbleResults[1]) {
                                    // We lost the key
                                    data.discard = true
                                    interaction.reply(getText(data))
                                    discardChastityKey(chastitywearer.id);
                                }
                                else {
                                    data.nodiscard = true
                                    interaction.reply(getText(data));
                                }
                            }
                            else {
                                // We didnt lose the keys
                                data.nofumble = true
                                interaction.reply(getText(data))
                                removeChastity(chastitywearer.id)
                            }
                        }
                        else {
                            // We don't have the keys
                            data.nokey = true
                            interaction.reply(getText(data))
                        }
                    }
                    else {
                        // We aren't in chastity
                        data.nochastity = true
                        interaction.reply(getText(data))
                    }
                }
                else {
                    // This is someone else
                    data.other = true
                    if (getChastity(chastitywearer.id)) {
                        // They are in chastity
                        data.chastity = true
                        if (getChastity(chastitywearer.id).keyholder == interaction.user.id) {
                            // We have their chastity key
                            data.key = true
                            const fumbleResults = rollKeyFumbleN(interaction.user.id, chastitywearer.id, 2);
                            if (fumbleResults[0]) {
                                // We fumbled the key
                                data.fumble = true
                                if (optins.getKeyDiscarding(chastitywearer.id) && fumbleResults[1]) {
                                    // We lost the key
                                    data.discard = true
                                    interaction.reply(getText(data))
                                    discardChastityKey(chastitywearer.id);
                                }
                                else {
                                    data.nodiscard = true
                                    interaction.reply(getText(data))
                                }
                            }
                            else {
                                // did not fumble!
                                data.nofumble = true
                                interaction.reply(getText(data))
                                removeChastity(chastitywearer.id)
                            }
                        }
                        else {
                            // We don't have their chastity key
                            data.nokey = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // They aren't in a chastity belt
                        data.nochastity = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
            }
            console.log(data)
        }
        catch (err) {
            console.log(err);
        }
    }
}