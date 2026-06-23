const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { collartypes } = require("./../functions/collarfunctions.js");
const { handleConsent, collarPermModal } = require("./../functions/interactivefunctions.js");
const { getTextGeneric } = require("./../functions/textfunctions.js");
const { handleTouchEvent, shockUser } = require("../functions/touchfunctions.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { getCollarName } = require("../functions/getters/collar/getCollarName.js");
const { getCollar } = require("../functions/getters/collar/getCollar.js");
const { getOption } = require("../functions/getters/config/getOption.js");
const { addArousal } = require("../functions/setters/arousal/addArousal.js");
const { statsAddCounter } = require("../functions/setters/config/statsAddCounter.js");
const { canAccessCollar } = require("../functions/getters/collar/canAccessCollar.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("shock")
		.setDescription("Attempt to shock someone with a remote control")
        .addUserOption((opt) => opt.setName("user").setDescription("Who to shock?")),
	async execute(interaction) {
		try {
            let targetuser = interaction.options.getUser("user") ?? interaction.user;
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.guildId, targetuser.id)?.mainconsent) {
				await handleConsent(interaction, targetuser.id);
				return;
			}
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.guildId, interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			// Build data tree:
			let data = {
                serverID: interaction.guildId, 
                interactionuser: { id: interaction.user.id },
                targetuser: { id: targetuser.id },
                c1: getCollarName(interaction.guildId, targetuser.id, getCollar(interaction.guildId, targetuser.id)?.collartype) ?? "collar"
            }
            // Figure out the tone to shock the user with
            let tone = getOption(interaction.guildId, targetuser.id, "shocktone") ?? "playful";
            if (tone == "both") {
                if (Math.random() > 0.5) { 
                    tone = "playful" 
                }
                else { 
                    tone = "painful" 
                };
            }

            if (targetuser.id != interaction.user.id) {
                if (!getCollar(interaction.guildId, targetuser.id)) {
                    await interaction.reply({ content: `<@${targetuser.id}> isn't wearing a collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                if ((getCollar(interaction.guildId, targetuser.id)?.collartype != "remoteshockcollar") && !(getCollar(interaction.guildId, targetuser.id)?.additionalcollars?.includes("remoteshockcollar"))) {
                    await interaction.reply({ content: `<@${targetuser.id}> isn't wearing a remote controlled shock collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                await handleTouchEvent(interaction.guildId, interaction.user, targetuser, "shock", true).then(
                    async (success) => {
                        addArousal(interaction.guildId, targetuser.id, (2.0 + Math.random() * 6.0)); // Add 2-8 arousal.
                        await interaction.reply({ content: getTextGeneric(`remotecontrolshock_other_${tone}`, data) })
                        statsAddCounter(interaction.guildId, targetuser.id, "timesshocked");
                        shockUser(interaction.guildId, targetuser.id)
                    },
                    async (failure) => {
                        await interaction.reply({ content: `You don't have access to <@${targetuser.id}>'s collar remote control!`, flags: MessageFlags.Ephemeral })
                    }
                )
            }
            else {
                if (!getCollar(interaction.guildId, targetuser.id)) {
                    await interaction.reply({ content: `You aren't wearing a collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                if ((getCollar(interaction.guildId, targetuser.id)?.collartype != "remoteshockcollar") && !(getCollar(interaction.guildId, targetuser.id)?.additionalcollars?.includes("remoteshockcollar"))) {
                    await interaction.reply({ content: `You aren't wearing a remote controlled shock collar.`, flags: MessageFlags.Ephemeral })
                    return;
                }
                if (!canAccessCollar(interaction.guildId, targetuser.id, interaction.user.id).access) {
                    await interaction.reply({ content: `You don't have access to your collar's remote control!`, flags: MessageFlags.Ephemeral })
                    return;
                }
                addArousal(interaction.guildId, targetuser.id, (2.0 + Math.random() * 6.0)); // Add 2-8 arousal.
                await interaction.reply({ content: getTextGeneric(`remotecontrolshock_self_${tone}`, data) })
                statsAddCounter(interaction.guildId, targetuser.id, "timesshocked");
                statsAddCounter(interaction.guildId, targetuser.id, "timesshockedself");
                shockUser(interaction.guildId, targetuser.id)
            }
		} catch (err) {
			console.log(err);
		}
	},
};
