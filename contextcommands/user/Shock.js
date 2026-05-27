const { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags } = require('discord.js');
const { canAccessCollar, getCollar, getCollarName } = require('../../functions/collarfunctions');
const { getTextGeneric } = require('../../functions/textfunctions');
const { addArousal } = require('../../functions/vibefunctions');
const { handleTouchEvent } = require('../../functions/touchfunctions');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Shock')
        .setType(ApplicationCommandType.User), // This command will appear when right-clicking a user
    async execute(interaction) {
        try {
            let data = {
                interactionuser: { id: interaction.user.id },
                targetuser: { id: interaction.targetId },
                c1: getCollarName(interaction.targetId, getCollar(interaction.targetId)?.collartype) ?? "collar"
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
                        await interaction.reply({ content: getTextGeneric("remotecontrolshock_other", data) })
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
                await interaction.reply({ content: getTextGeneric("remotecontrolshock_self", data) })
            }
        } catch (err) {
            console.log(err);
        }
    },
}