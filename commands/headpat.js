const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { handleConsent, collarPermModal } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { rollPatChance, handleTouchEvent } = require("../functions/touchfunctions.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { getPronouns } = require("../functions/getters/config/getPronouns.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("headpat")
		.setDescription("Attempt to pat someone's head")
        .addUserOption((opt) => opt.setName("user").setDescription("Who to headpat?")),
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
				textarray: "texts_touch",
				textdata: {
					interactionuser: interaction.user,
					targetuser: targetuser,
					//c1: getHeavy(interaction.user.id)?.displayname, // heavy bondage type
					//c2: getMittenName(interaction.user.id, chosenmittens) ?? "Standard Mittens",
				},
			};

            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            await handleTouchEvent(interaction.user, targetuser, "headpat").then(
                async (success) => {
                    await interaction.followUp({ content: `Headpatting ${targetuser}`, flags: MessageFlags.Ephemeral })
                    let headpatattempt = rollPatChance(interaction.user.id, targetuser.id)
                    data.headpat = true;

                    if (interaction.user.id == targetuser.id) {
                        data.self = true;
                    }
                    else {
                        data.other = true;
                    }

                    if (headpatattempt.hit) {
                        data.hit = true;
                    }
                    else {
                        data.nohit = true;
                    }

                    if (headpatattempt.crit) {
                        if (headpatattempt.doublecrit) {
                            if (headpatattempt.triplecrit) {
                                data.triplecrit = true;
                            }
                            else {
                                data.doublecrit = true
                            }
                        }
                        else {
                            data.crit = true;
                        }
                    }
                    else {
                        data.nocrit = true;
                    }

                    if (headpatattempt.boundmiss) {
                        data[headpatattempt.boundmiss] = true;
                    }
                    else {
                        data.noboundmiss = true;
                    }

                    interaction.followUp({ content: getText(data) });
                },
                async (reject) => {
                    let nomessage = `${targetuser} rejected the headpat.`;
                    if (reject == "Error") {
                        nomessage = `Something went wrong - Submit a bug report!`;
                    }
                    if (reject == "NoDM") {
                        nomessage = `Something went wrong sending a DM to ${targetuser}, or ${getPronouns(targetuser.id, "subject")} ${getPronouns(targetuser.id, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent to touch.`;
                    }
                    await interaction.followUp({ content: nomessage });
                },
            );
		} catch (err) {
			console.log(err);
		}
	},
};
