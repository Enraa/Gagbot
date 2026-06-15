const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { handleConsent } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { getHeavy } = require("../functions/getters/heavy/getHeavy.js");
const { getCollarName } = require("../functions/getters/collar/getCollarName.js");
const { getCollar } = require("../functions/getters/collar/getCollar.js");
const { getHeavyBound } = require("../functions/getters/heavy/getHeavyBound.js");
const { canAccessCollar } = require("../functions/getters/collar/canAccessCollar.js");
const { removeCollar } = require("../functions/setters/collar/removeCollar.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("uncollar")
		.setDescription(`Unlock a collar`)
        .addUserOption((opt) => opt.setName("user").setDescription("Whose collar to unlock (blank for your own)")),
	async execute(interaction) {
		try {
			let collaruser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
			// Build data tree:
			let data = {
				textarray: "texts_uncollar",
				textdata: {
					interactionuser: interaction.user,
					targetuser: collaruser,
					c1: getHeavy(interaction.user.id)?.displayname, // heavy bondage type
                    c2: getCollarName(collaruser.id, getCollar(collaruser.id)?.collartype) ?? "collar"
				},
			};

			if (!getHeavyBound(interaction.user.id, interaction.user.id)) {
				// in heavy bondage, can't
				data.heavy = true;
				if (interaction.user == collaruser) {
					// This is ourselves
					data.self = true;
					if (getCollar(interaction.user.id)) {
						// we are wearing a collar
						data.collar = true;
						interaction.reply(getText(data));
					} else {
						// We dont have a collar on. Ephemeral
						data.nocollar = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				} else {
					// This is someone else
					data.other = true;
					if (getCollar(collaruser.id)) {
						// They are wearing a collar
						data.collar = true;
						interaction.reply(getText(data));
					} else {
						// They dont have a collar on. Ephemeral
						data.nocollar = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				}
			} else {
				// Not in heavy bondage!
				data.noheavy = true;
				if (interaction.user == collaruser) {
					// This is ourselves
					data.self = true;
					if (getCollar(collaruser.id)) {
						// we are wearing a collar
						data.collar = true;
						if (canAccessCollar(collaruser.id, interaction.user.id, true).access) {
							// We have the key to our own collar
							data.key = true;
							interaction.reply(getText(data));
							removeCollar(collaruser.id);
						} else {
							// We do not have the key to our collar.
							data.nokey = true;
							interaction.reply(getText(data));
						}
					} else {
						// We dont have a collar on. Ephemeral
						data.nocollar = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				} else {
					// This is someone else
					data.other = true;
					if (getCollar(collaruser.id)) {
						// they are wearing a collar
						data.collar = true;
						if (canAccessCollar(collaruser.id, interaction.user.id, true).access) {
							// We have the key to their collar
							data.key = true;
							interaction.reply(getText(data));
							removeCollar(collaruser.id);
						} else {
							// We do not have the key to their collar. Ephemeral
							data.nokey = true;
							if (!getCollar(collaruser.id).keyholderOnly && getCollar(collaruser.id).keyholder == collaruser.id) {
								// They're wearing an unlocked collar - its their choice!
								data.nokeyholderonly = true;
								interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
							} else {
								// Their collar belongs to themselves or someone else.
								data.keyholderonly = true;
								interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
							}
						}
					} else {
						// They dont have a collar on. Ephemeral
						data.nocollar = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
};
