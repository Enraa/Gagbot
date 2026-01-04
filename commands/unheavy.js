const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy, removeHeavy, convertheavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");
const { checkBondageRemoval, handleBondageRemoval } = require('../functions/interactivefunctions.js');

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
            let data = {
                textarray: "texts_unheavy",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: heavyuser,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                    c2: getHeavy(heavyuser.id)?.type // Target's heavy bondage
                }
            }

            if (!getHeavy(heavyuser.id)) {
                // They aren't bound lol. 
                data.noheavy = true
                data.noheavyequipped = true
                data.other = true
                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                return;
            }

            if (getHeavy(interaction.user.id)) {
                // user IS in heavy bondage
                data.heavy = true
                if (interaction.user == heavyuser) {
                    data.self = true;
                    interaction.reply(getText(data))
                    return;
                }
                else {
                    data.other = true;
                    interaction.reply(getText(data))
                    return;
                }
            }
            else {
                // Not in heavy bondage
                data.noheavy = true
                if (getHeavy(heavyuser.id)) {
                    data.heavyequipped = true
                    // Now lets make sure the wearer wants that.
                    if (checkBondageRemoval(interaction.user.id, heavyuser.id, "heavy") == true) {
                        // Allowed immediately, lets go
                        interaction.reply(getText(data))
                        removeHeavy(heavyuser.id)
                    }
                    else {
                        // We need to ask first. 
                        let datatogeneric = Object.assign({}, data.textdata);
                        datatogeneric.c1 = "heavy bondage";
                        interaction.reply({ content: getTextGeneric("unbind", datatogeneric), flags: MessageFlags.Ephemeral })
                        let canRemove = await handleBondageRemoval(interaction.user, heavyuser, "heavy bondage").then(async (res) => {
                            await interaction.editReply(getTextGeneric("unbind_accept", datatogeneric))
                            await interaction.followUp(getText(data))
                            removeHeavy(heavyuser.id)
                        }, async (rej) => {
                            await interaction.editReply(getTextGeneric("unbind_decline", datatogeneric))
                        })
                    }
                }
                else {
                    data.noheavyequipped = true
                    if (heavyuser == interaction.user) {
                        data.self = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                    else {
                        data.other = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}