const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, canAccessChastity } = require('./../functions/vibefunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getCorset, removeCorset } = require('./../functions/corsetfunctions.js');
const { rollKeyFumbleN } = require('../functions/keyfindingfunctions.js');
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");
const { checkBondageRemoval, handleBondageRemoval } = require('../functions/interactivefunctions.js');
const { config } = require('../functions/configfunctions.js');

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
                            if (canAccessChastity(corsetuser.id, interaction.user.id).access) {
                                // We own the key for the chastity belt
                                data.key = true
                                const fumbleResults = rollKeyFumbleN(interaction.user.id, corsetuser.id, 2);
                                if (fumbleResults[0]) {
                                    // We fumbled the key
                                    data.fumble = true;
                                    if (config.getKeyLoss(corsetuser.id) && fumbleResults[1]) {
                                        // We lost the key while fumbling
                                        data.discard = true;
                                        let discardresult = discardChastityKey(corsetuser.id, interaction.user.id)
                                        data[discardresult] = true
                                        interaction.reply(getText(data));
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
                                interaction.reply(getText(data));
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
                            if (canAccessChastity(corsetuser.id, interaction.user.id).access && !canAccessChastity(corsetuser.id, interaction.user.id).public) {
                                // We own the key for the chastity belt and it is NOT sealed.
                                data.key = true
                                const fumbleResults = rollKeyFumbleN(interaction.user.id, corsetuser.id, 2);
                                if (fumbleResults[0]) {
                                    // We fumbled the key
                                    data.fumble = true;
                                    if (config.getKeyLoss(corsetuser.id) && fumbleResults[1]) {
                                        // We lost the key while fumbling
                                        data.discard = true;
                                        let discardresult = discardChastityKey(corsetuser.id, interaction.user.id)
                                        data[discardresult] = true
                                        interaction.reply(getText(data));
                                    }
                                    else {
                                        data.nodiscard = true;
                                        interaction.reply(getText(data));
                                    }
                                }
                                else {
                                    // We didnt fumble!
                                    data.nofumble = true;
                                    // Now lets make sure the wearer wants that.
                                    if (checkBondageRemoval(interaction.user.id, corsetuser.id, "corset") == true) {
                                        // Allowed immediately, lets go
                                        interaction.reply(getText(data))
                                        removeCorset(corsetuser.id)
                                    }
                                    else {
                                        // We need to ask first. 
                                        let datatogeneric = Object.assign({}, data.textdata);
                                        datatogeneric.c1 = "corset";
                                        interaction.reply({ content: getTextGeneric("unbind", datatogeneric), flags: MessageFlags.Ephemeral })
                                        let canRemove = await handleBondageRemoval(interaction.user, corsetuser, "corset").then(async (res) => {
                                            await interaction.editReply(getTextGeneric("unbind_accept", datatogeneric))
                                            await interaction.followUp(getText(data))
                                            removeCorset(corsetuser.id)
                                        }, async (rej) => {
                                            await interaction.editReply(getTextGeneric("unbind_decline", datatogeneric))
                                        })
                                    }
                                }
                            }
                            else if (canAccessChastity(corsetuser.id, interaction.user.id).access && canAccessChastity(corsetuser.id, interaction.user.id).public) {
                                // This is a public access belt!
                                data.public = true
                                // Now lets make sure the wearer wants that.
                                if (checkBondageRemoval(interaction.user.id, corsetuser.id, "corset") == true) {
                                    // Allowed immediately, lets go
                                    interaction.reply(getText(data))
                                    removeCorset(corsetuser.id)
                                }
                                else {
                                    // We need to ask first. 
                                    let datatogeneric = Object.assign({}, data.textdata);
                                    datatogeneric.c1 = "corset";
                                    interaction.reply({ content: getTextGeneric("unbind", datatogeneric), flags: MessageFlags.Ephemeral })
                                    let canRemove = await handleBondageRemoval(interaction.user, corsetuser, "corset").then(async (res) => {
                                        await interaction.editReply(getTextGeneric("unbind_accept", datatogeneric))
                                        await interaction.followUp(getText(data))
                                        removeCorset(corsetuser.id)
                                    }, async (rej) => {
                                        await interaction.editReply(getTextGeneric("unbind_decline", datatogeneric))
                                    })
                                }
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
                            // Now lets make sure the wearer wants that.
                            if (checkBondageRemoval(interaction.user.id, corsetuser.id, "corset") == true) {
                                // Allowed immediately, lets go
                                interaction.reply(getText(data))
                                removeCorset(corsetuser.id)
                            }
                            else {
                                // We need to ask first. 
                                let datatogeneric = Object.assign({}, data.textdata);
                                datatogeneric.c1 = "corset";
                                interaction.reply({ content: getTextGeneric("unbind", datatogeneric), flags: MessageFlags.Ephemeral })
                                let canRemove = await handleBondageRemoval(interaction.user, corsetuser, "corset").then(async (res) => {
                                    await interaction.editReply(getTextGeneric("unbind_accept", datatogeneric))
                                    await interaction.followUp(getText(data))
                                    removeCorset(corsetuser.id)
                                }, async (rej) => {
                                    await interaction.editReply(getTextGeneric("unbind_decline", datatogeneric))
                                })
                            }
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