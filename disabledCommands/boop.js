const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { handleConsent, collarPermModal } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { rollPatChance, handleTouchEvent } = require("../functions/touchfunctions.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { getPronouns } = require("../functions/getters/config/getPronouns.js");
const { getHeadwearRestrictions } = require("../functions/getters/headwear/getHeadwearRestrictions.js");
const { getHeavyRestrictions } = require("../functions/getters/heavy/getHeavyRestrictions.js");
const { getGag } = require("../functions/getters/gag/getGag.js");
const { getMitten } = require("../functions/getters/mitten/getMitten.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("boop")
		.setDescription("Attempt to boop someone")
        .addUserOption((opt) => opt.setName("user").setDescription("Who to boop?")),
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
				textarray: "texts_touch",
				textdata: {
                    serverID: interaction.guildId, 
					interactionuser: interaction.user,
					targetuser: targetuser,
					//c1: getHeavy(interaction.user.id)?.displayname, // heavy bondage type
					//c2: getMittenName(interaction.user.id, chosenmittens) ?? "Standard Mittens",
				},
			};

            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            await handleTouchEvent(interaction.guildId, interaction.user, targetuser, "boop").then(
                async (success) => {
                    await interaction.followUp({ content: `Hugging ${targetuser}`, flags: MessageFlags.Ephemeral })
                    data.hug = true;

                    if (interaction.user.id == targetuser.id) {
                        data.self = true;
                    }
                    else {
                        data.other = true;
                    }

                    if (!getHeavyRestrictions(interaction.guildId, interaction.user.id).touchself) {
                        data.heavy = true;
                    }
                    else if (getMitten(interaction.guildId, interaction.user.id)) {
                        data.mitten = true;
                    }
                    else {
                        data.free = true;
                    }

                    interaction.followUp({ content: getText(data) });
                },
                async (reject) => {
                    let nomessage = `${targetuser} rejected the boop!`;
                    if (reject == "Error") {
                        nomessage = `Something went wrong - Submit a bug report!`;
                    }
                    if (reject == "NoDM") {
                        nomessage = `Something went wrong sending a DM to ${targetuser}, or ${getPronouns(interaction.guildId, targetuser.id, "subject")} ${getPronouns(interaction.guildId, targetuser.id, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent to touch.`;
                    }
                    await interaction.followUp({ content: nomessage });
                },
            );
		} catch (err) {
			console.log(err);
		}
	},
};
