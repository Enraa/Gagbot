const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { handleConsent } = require("./../functions/interactivefunctions.js");
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");
const { checkBondageRemoval, handleBondageRemoval } = require("../functions/interactivefunctions.js");
const { getMittenName } = require("../functions/getters/mitten/getMittenName.js");
const { getMitten } = require("../functions/getters/mitten/getMitten.js");
const { getHeavy } = require("../functions/getters/heavy/getHeavy.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { getHeavyBound } = require("../functions/getters/heavy/getHeavyBound.js");
const { getGag } = require("../functions/getters/gag/getGag.js");
const { deleteMitten } = require("../functions/setters/mitten/removeMitten.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unmitten")
		.setDescription(`Take someone else's mittens off`)
        .addUserOption((opt) => opt.setName("user").setDescription("Who to free from their mittens")),
	async execute(interaction) {
		try {
			let mitteneduser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let data = {
				textarray: "texts_unmitten",
				textdata: {
					interactionuser: interaction.user,
					targetuser: mitteneduser,
					c1: getHeavy(interaction.user.id)?.displayname, // heavy bondage type
                    c2: getMittenName(getMitten(mitteneduser.id)?.mittenname) ?? "mittens"
				},
			};
			if (!getHeavyBound(interaction.user.id, mitteneduser.id)) {
				data.heavy = true;
				if (interaction.options.getUser("user") == interaction.user) {
					data.self = true;
					interaction.reply(getText(data));
				} else {
					data.other = true;
					interaction.reply(getText(data));
				}
			} else if (getMitten(mitteneduser.id)) {
				data.noheavy = true;
				if (mitteneduser != interaction.user) {
					data.other = true;
					if (getGag(mitteneduser.id)) {
						data.gag = true;
						// Now lets make sure the wearer wants that.
						if (checkBondageRemoval(interaction.user.id, mitteneduser.id, "mitten") == true) {
							// Allowed immediately, lets go
							interaction.reply(getText(data));
							deleteMitten(mitteneduser.id);
						} else {
							// We need to ask first.
							let datatogeneric = Object.assign({}, data.textdata);
							datatogeneric.c1 = "mittens";
							interaction.reply({ content: getTextGeneric("unbind", datatogeneric), flags: MessageFlags.Ephemeral });
							let canRemove = await handleBondageRemoval(interaction.user, mitteneduser, "mittens").then(
								async (res) => {
									await interaction.editReply(getTextGeneric("unbind_accept", datatogeneric));
									await interaction.followUp(getText(data));
									deleteMitten(mitteneduser.id);
								},
								async (rej) => {
									await interaction.editReply(getTextGeneric("unbind_decline", datatogeneric));
								},
							);
						}
					} else {
						data.nogag = true;
						// Now lets make sure the wearer wants that.
						if (checkBondageRemoval(interaction.user.id, mitteneduser.id, "mitten") == true) {
							// Allowed immediately, lets go
							interaction.reply(getText(data));
							deleteMitten(mitteneduser.id);
						} else {
							// We need to ask first.
							let datatogeneric = Object.assign({}, data.textdata);
							datatogeneric.c1 = "mittens";
							interaction.reply({ content: getTextGeneric("unbind", datatogeneric), flags: MessageFlags.Ephemeral });
							let canRemove = await handleBondageRemoval(interaction.user, mitteneduser, "mittens").then(
								async (res) => {
									await interaction.editReply(getTextGeneric("unbind_accept", datatogeneric));
									await interaction.followUp(getText(data));
									deleteMitten(mitteneduser.id);
								},
								async (rej) => {
									await interaction.editReply(getTextGeneric("unbind_decline", datatogeneric));
								},
							);
						}
					}
				} else {
					data.self = true;
					interaction.reply(getText(data));
				}
			} else {
				data.otherother = true;
                if (mitteneduser == interaction.user) {
                    data.self = true
                }
                else {
                    data.other = true;
                }
				interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
			}
		} catch (err) {
			console.log(err);
		}
	},
};
