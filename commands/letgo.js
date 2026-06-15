const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { their } = require("./../functions/pronounfunctions.js");
const { handleConsent } = require("./../functions/interactivefunctions.js");
const { tryOrgasm, setArousalCooldown } = require("../functions/vibefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { getHeavy } = require("../functions/getters/heavy/getHeavy.js");
const { getChastity } = require("../functions/getters/chastity/getChastity.js");
const { getHeavyBound } = require("../functions/getters/heavy/getHeavyBound.js");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("letgo")
        .setDescription(`Try to get release`),
	async execute(interaction) {
		try {
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}

			// Build data tree:
			let data = {
				textarray: "texts_letgo",
				textdata: {
					interactionuser: interaction.user,
					targetuser: interaction.user, // Not needed, but required for function parsing anyway.
					c1: getHeavy(interaction.user.id)?.displayname, // heavy bondage type
				},
			};

			if (tryOrgasm(interaction.user.id)) {
				// User was able to orgasm!
				data.orgasm = true;
				interaction.reply(getText(data));
			} else {
				if (getChastity(interaction.user.id)) {
					data.chastity = true;
					interaction.reply(getText(data));
					return;
				}

				const heavy = !getHeavyBound(interaction.user.id, interaction.user.id);
				if (heavy) {
					data.heavy = true;
					interaction.reply(getText(data));
					return;
				}

				// cool off response, replace with something good
				data.free = true;
				interaction.reply(getText(data));
				setArousalCooldown(interaction.user.id);
			}
		} catch (err) {
			console.log(err);
		}
	},
};
