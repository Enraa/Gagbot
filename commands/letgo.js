const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { their } = require("./../functions/pronounfunctions.js");
const { handleConsent } = require("./../functions/interactivefunctions.js");
const { tryOrgasm, setArousalCooldown } = require("../functions/vibefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { getHeavy } = require("../functions/getters/heavy/getHeavy.js");
const { getChastity } = require("../functions/getters/chastity/getChastity.js");
const { getHeavyBound } = require("../functions/getters/heavy/getHeavyBound.js");
const { isWearingCollar } = require("../functions/getters/collar/isWearingCollar.js");
const { getCurrentHoliday } = require("../functions/events/getCurrentHoliday.js");
const { holidayNNNLetGoPrompt } = require("../functions/events/holidayNNNletgoprompt.js");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("letgo")
        .setDescription(`Try to get release`),
	async execute(interaction) {
		try {
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.guildId, interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}

			// Build data tree:
			let data = {
				textarray: "texts_letgo",
				textdata: {
                    serverID: interaction.guildId, 
					interactionuser: interaction.user,
					targetuser: interaction.user, // Not needed, but required for function parsing anyway.
					c1: getHeavy(interaction.guildId, interaction.user.id)?.displayname, // heavy bondage type
				},
			};

            let nonut = false;
            if (getCurrentHoliday("NNN")) {
                await holidayNNNLetGoPrompt(interaction).then(
                    async (accepted) => {
                        // Bad girl for accepting the attempt to let go! 
                        // Mark their shame accordingly.
                    },
                    async (rejected) => {
                        nonut = true;
                    }
                )
            }

            if (nonut) { return };
			if (tryOrgasm(interaction.guildId, interaction.user.id)) {
				// User was able to orgasm!
				data.orgasm = true;
                if (getCurrentHoliday("NNN")) { 
                    interaction.followUp(getText(data)) 
                }
                else {
                    interaction.reply(getText(data));
                }
			} else {
                if (isWearingCollar(interaction.guildId, interaction.user.id, "collar_orgasmcontrol")) {
                    data.orgasmcontrolled = true;
                    if (getCurrentHoliday("NNN")) { 
                        interaction.followUp(getText(data)) 
                    }
                    else {
                        interaction.reply(getText(data));
                    }
                    return;
                }

				if (getChastity(interaction.guildId, interaction.user.id)) {
					data.chastity = true;
					if (getCurrentHoliday("NNN")) { 
                        interaction.followUp(getText(data)) 
                    }
                    else {
                        interaction.reply(getText(data));
                    }
					return;
				}

				const heavy = !getHeavyBound(interaction.guildId, interaction.user.id, interaction.user.id);
				if (heavy) {
					data.heavy = true;
					if (getCurrentHoliday("NNN")) { 
                        interaction.followUp(getText(data)) 
                    }
                    else {
                        interaction.reply(getText(data));
                    }
					return;
				}

				// cool off response, replace with something good
				data.free = true;
				if (getCurrentHoliday("NNN")) { 
                    interaction.followUp(getText(data)) 
                }
                else {
                    interaction.reply(getText(data));
                }
				setArousalCooldown(interaction.guildId, interaction.user.id);
			}
		} catch (err) {
			console.log(err);
		}
	},
};
