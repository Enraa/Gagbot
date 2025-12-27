const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity } = require('./../functions/vibefunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getCorset, removeCorset } = require('./../functions/corsetfunctions.js');
const { optins } = require('../functions/optinfunctions.js');
const { rollKeyFumbleN } = require('../functions/keyfindingfunctions.js');
const { getText } = require("./../functions/textfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uncorset')
		.setDescription('Remove a corset')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('Who to remove the corset from')
        ),
    async execute(interaction) {
        try {
            let corsetuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            let data = {
                textarray: "texts_uncorset",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: corsetuser,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                }
            }

            if (getHeavy(interaction.user.id)) {
                // User is in heavy bondage
                data.heavy = true
                if (corsetuser == interaction.user) {
                    // Working with ourselves!
                    data.self = true
                    if (getCorset(corsetuser.id)) {
                        // We are wearing a corset!
                        data.corset = true
                        if (getChastity(corsetuser.id)) {
                            // We're in a chastity belt!
                            data.chastity = true
                            interaction.reply(getText(data));
                        }
                        else {
                            // We're not belted
                            data.nochastity = true
                            interaction.reply(getText(data));
                        }
                    }
                    else {
                        // We're not in a corset
                        data.nocorset = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    // Working with others
                    data.other = true
                    if (getCorset(corsetuser.id)) {
                        // They are wearing a corset!
                        data.corset = true
                        if (getChastity(corsetuser.id)) {
                            // They're in a chastity belt!
                            data.chastity = true
                            interaction.reply(getText(data));
                        }
                        else {
                            // They're not belted
                            data.nochastity = true
                            interaction.reply(getText(data));
                        }
                    }
                    else {
                        // They're not in a corset
                        data.nocorset = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
            }
            else {
                // User is not in heavy bondage
                data.noheavy = true
                if (corsetuser == interaction.user) {
                    // Working with ourselves!
                    data.self = true
                    if (getCorset(corsetuser.id)) {
                        // We are wearing a corset!
                        data.corset = true
                        if (getChastity(corsetuser.id)) {
                            // We're in a chastity belt!
                            data.chastity = true
                            if ((getChastity(corsetuser.id)?.access == undefined) && getChastity(corsetuser.id).keyholder == interaction.user.id) {
                                // We own the key for the chastity belt
                                data.key = true
                                const fumbleResults = rollKeyFumbleN(interaction.user.id, corsetuser.id, 2);
                                if (fumbleResults[0]) {
                                    // We fumbled the key
                                    data.fumble = true;
                                    if (optins.getKeyDiscarding(corsetuser.id) && fumbleResults[1]) {
                                        // We lost the key while fumbling
                                        data.discard = true;
                                        interaction.reply(getText(data));
                                        discardChastityKey(corsetuser.id);
                                    }
                                    else {
                                        data.nodiscard = true;
                                        interaction.reply(getText(data));
                                    }
                                }
                                else {
                                    // We didnt fumble!
                                    data.nofumble = true;
                                    interaction.reply(getText(data));
                                    removeCorset(corsetuser.id)
                                }
                            }
                            // Note, no public access to our own belt!
                            else {
                                // We do not own the key for the belt!
                                data.nokey = true
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
                        else {
                            // We're not belted
                            data.nochastity = true
                            interaction.reply(getText(data));
                            removeCorset(corsetuser.id)
                        }
                    }
                    else {
                        // We're not in a corset
                        data.nocorset = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
                else {
                    // Working with others
                    data.other = true
                    if (getCorset(corsetuser.id)) {
                        // They are wearing a corset!
                        data.corset = true
                        if (getChastity(corsetuser.id)) {
                            // They're in a chastity belt!
                            data.chastity = true
                            if ((getChastity(corsetuser.id)?.access !== 2) && (getChastity(corsetuser.id).keyholder == interaction.user.id)) {
                                // We own the key for the chastity belt and it is NOT sealed.
                                data.key = true
                                const fumbleResults = rollKeyFumbleN(interaction.user.id, corsetuser.id, 2);
                                if (fumbleResults[0]) {
                                    // We fumbled the key
                                    data.fumble = true;
                                    if (optins.getKeyDiscarding(corsetuser.id) && fumbleResults[1]) {
                                        // We lost the key while fumbling
                                        data.discard = true;
                                        interaction.reply(getText(data));
                                        discardChastityKey(corsetuser.id);
                                    }
                                    else {
                                        data.nodiscard = true;
                                        interaction.reply(getText(data));
                                    }
                                }
                                else {
                                    // We didnt fumble!
                                    data.nofumble = true;
                                    interaction.reply(getText(data));
                                    removeCorset(corsetuser.id)
                                }
                            }
                            else if (getChastity(corsetuser.id)?.access === 0 && corsetuser.id != interaction.user.id) {
                                // This is a public access belt!
                                data.public = true
                                interaction.reply(getText(data));
                                removeCorset(corsetuser.id)
                            }
                            else {
                                // We do not own the key for the belt!
                                data.nokey = true
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
                        else {
                            // They're not belted
                            data.nochastity = true
                            interaction.reply(getText(data));
                            removeCorset(corsetuser.id)
                        }
                    }
                    else {
                        // They're not in a corset
                        data.nocorset = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}