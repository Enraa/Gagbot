const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { getHeavy, getHeavyBound } = require("./../functions/heavyfunctions.js");
const { getCollar, assignCollar, collartypes, getCollarName, getBaseCollar, canAccessCollar } = require("./../functions/collarfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent, collarPermModal } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { getOption } = require("../functions/configfunctions.js");
const { getUserTags } = require("../functions/configfunctions.js");
const { rollPatChance, handleTouchEvent } = require("../functions/touchfunctions.js");

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
				await handleConsent(interaction, headwearuser.id);
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
                        if (Math.random() < 0.05) {
                            if (Math.random() > 0.95) {
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
                        nomessage = `Something went wrong sending a DM to ${targetuser}, or ${getPronouns(chastityuser.id, "subject")} ${getPronouns(chastityuser.id, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent to touch.`;
                    }
                    await interaction.followUp({ content: nomessage });
                },
            );
		} catch (err) {
			console.log(err);
		}
	},
};
