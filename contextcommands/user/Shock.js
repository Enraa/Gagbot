const { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags } = require('discord.js');
const { getTextGeneric } = require('../../functions/textfunctions');
const { handleTouchEvent, shockUser } = require('../../functions/touchfunctions');
const { getCollarName } = require('../../functions/getters/collar/getCollarName');
const { handleConsent } = require('../../functions/interactivefunctions');
const { getConsent } = require('../../functions/getters/config/getConsent');
const { getCollar } = require('../../functions/getters/collar/getCollar');
const { addArousal } = require('../../functions/setters/arousal/addArousal');
const { statsAddCounter } = require('../../functions/setters/config/statsAddCounter');
const { canAccessCollar } = require('../../functions/getters/collar/canAccessCollar');
const { getOption } = require('../../functions/getters/config/getOption');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Shock')
        .setType(ApplicationCommandType.User), // This command will appear when right-clicking a user
    async execute(interaction) {
        try {
            let targetuser = await interaction.guild.members.fetch(interaction.targetId)
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(targetuser.id)?.mainconsent) {
                await handleConsent(interaction, targetuser.id);
                return;
            }
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            let data = {
                interactionuser: { id: interaction.user.id },
                targetuser: { id: interaction.targetId },
                c1: getCollarName(interaction.targetId, getCollar(interaction.targetId)?.collartype) ?? "collar"
            }
            // Figure out the tone to shock the user with
            let tone = getOption(targetuser.id, "shocktone") ?? "playful";
            if (tone == "both") {
                if (Math.random() > 0.5) { 
                    tone = "playful" 
                }
                else { 
                    tone = "painful" 
                };
            }
            if (interaction.targetId != interaction.user.id) {
                if (!getCollar(interaction.targetId)) {
                    await interaction.reply({ content: `<@${interaction.targetId}> isn't wearing a collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                if ((getCollar(interaction.targetId)?.collartype != "remoteshockcollar") && !(getCollar(interaction.targetId)?.additionalcollars?.includes("remoteshockcollar"))) {
                    await interaction.reply({ content: `<@${interaction.targetId}> isn't wearing a remote controlled shock collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                await handleTouchEvent({ id: interaction.user.id }, { id: interaction.targetId }, "shock", true).then(
                    async (success) => {
                        addArousal(interaction.targetId, (2.0 + Math.random() * 6.0)); // Add 2-8 arousal.
                        await interaction.reply({ content: getTextGeneric(`remotecontrolshock_other_${tone}`, data) })
                        statsAddCounter(interaction.targetId, "timesshocked");
                        shockUser(interaction.targetId);
                    },
                    async (failure) => {
                        await interaction.reply({ content: `You don't have access to <@${interaction.targetId}>'s collar remote control!`, flags: MessageFlags.Ephemeral })
                    }
                )
            }
            else {
                if (!getCollar(interaction.targetId)) {
                    await interaction.reply({ content: `You aren't wearing a collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                if ((getCollar(interaction.targetId)?.collartype != "remoteshockcollar") && !(getCollar(interaction.targetId)?.additionalcollars?.includes("remoteshockcollar"))) {
                    await interaction.reply({ content: `You aren't wearing a remote controlled shock collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                if (!canAccessCollar(interaction.targetId, interaction.user.id).access) {
                    await interaction.reply({ content: `You don't have access to your collar's remote control!`, flags: MessageFlags.Ephemeral })
                    return;
                }
                addArousal(interaction.targetId, (2.0 + Math.random() * 6.0)); // Add 2-8 arousal.
                await interaction.reply({ content: getTextGeneric(`remotecontrolshock_self_${tone}`, data) })
                statsAddCounter(interaction.targetId, "timesshocked");
                statsAddCounter(interaction.targetId, "timesshockedself");
                shockUser(interaction.targetId);
            }
        } catch (err) {
            console.log(err);
        }
    },
}