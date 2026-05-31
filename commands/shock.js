const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { getHeavy, getHeavyBound } = require("./../functions/heavyfunctions.js");
const { getCollar, assignCollar, collartypes, getCollarName, getBaseCollar, canAccessCollar } = require("./../functions/collarfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent, collarPermModal } = require("./../functions/interactivefunctions.js");
const { getTextGeneric } = require("./../functions/textfunctions.js");
const { getOption } = require("../functions/configfunctions.js");
const { getUserTags } = require("../functions/configfunctions.js");
const { handleTouchEvent, shockUser } = require("../functions/touchfunctions.js");
const { addArousal } = require("../functions/vibefunctions.js");
const { statsAddCounter } = require("../functions/statsfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("shock")
		.setDescription("Attempt to shock someone with a remote control")
        .setNSFW(true)
		.addUserOption((opt) => opt.setName("user").setDescription("Who to shock?")),
	async execute(interaction) {
		try {
            let targetuser = interaction.options.getUser("user") ?? interaction.user;
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
			// Build data tree:
			let data = {
                interactionuser: { id: interaction.user.id },
                targetuser: { id: targetuser.id },
                c1: getCollarName(targetuser.id, getCollar(targetuser.id)?.collartype) ?? "collar"
            }

            if (targetuser.id != interaction.user.id) {
                if (!getCollar(targetuser.id)) {
                    await interaction.reply({ content: `<@${targetuser.id}> isn't wearing a collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                if ((getCollar(targetuser.id)?.collartype != "remoteshockcollar") && !(getCollar(targetuser.id)?.additionalcollars?.includes("remoteshockcollar"))) {
                    await interaction.reply({ content: `<@${targetuser.id}> isn't wearing a remote controlled shock collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                await handleTouchEvent(interaction.user, targetuser, "shock", true).then(
                    async (success) => {
                        addArousal(targetuser.id, (2.0 + Math.random() * 6.0)); // Add 2-8 arousal.
                        await interaction.reply({ content: getTextGeneric("remotecontrolshock_other", data) })
                        statsAddCounter(targetuser.id, "timesshocked");
                        shockUser(targetuser.id)
                    },
                    async (failure) => {
                        await interaction.reply({ content: `You don't have access to <@${targetuser.id}>'s collar remote control!`, flags: MessageFlags.Ephemeral })
                    }
                )
            }
            else {
                if (!getCollar(targetuser.id)) {
                    await interaction.reply({ content: `You aren't wearing a collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                if ((getCollar(targetuser.id)?.collartype != "remoteshockcollar") && !(getCollar(targetuser.id)?.additionalcollars?.includes("remoteshockcollar"))) {
                    await interaction.reply({ content: `You aren't wearing a remote controlled shock collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                if (!canAccessCollar(targetuser.id, interaction.user.id).access) {
                    await interaction.reply({ content: `You don't have access to your collar's remote control!`, flags: MessageFlags.Ephemeral })
                    return;
                }
                addArousal(targetuser.id, (2.0 + Math.random() * 6.0)); // Add 2-8 arousal.
                await interaction.reply({ content: getTextGeneric("remotecontrolshock_self", data) })
                statsAddCounter(targetuser.id, "timesshocked");
                statsAddCounter(targetuser.id, "timesshockedself");
                shockUser(targetuser.id)
            }
		} catch (err) {
			console.log(err);
		}
	},
};
