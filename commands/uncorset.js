const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { handleConsent } = require("./../functions/interactivefunctions.js");
const { rollKeyFumble } = require("../functions/keyfindingfunctions.js");
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");
const { checkBondageRemoval, handleBondageRemoval } = require("../functions/interactivefunctions.js");
const { config } = require("../functions/configfunctions.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { getHeavy } = require("../functions/getters/heavy/getHeavy.js");
const { getBaseCorset } = require("../functions/getters/corset/getBaseCorset.js");
const { getCorset } = require("../functions/getters/corset/getCorset.js");
const { getHeavyBound } = require("../functions/getters/heavy/getHeavyBound.js");
const { getChastity } = require("../functions/getters/chastity/getChastity.js");
const { canAccessChastity } = require("../functions/getters/chastity/canAccessChastity.js");
const { getBaseChastity } = require("../functions/getters/chastity/getBaseChastity.js");
const { getOption } = require("../functions/getters/config/getOption.js");
const { removeCorset } = require("../functions/setters/corset/removeCorset.js");
const { canRemoveLock } = require("../functions/getters/lock/canRemoveLock.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("uncorset")
		.setDescription("Remove a corset")
        .addUserOption((opt) => opt.setName("user").setDescription("Who to remove the corset from")),
	async execute(interaction) {
		try {
			let corsetuser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.guildId, interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let data = {
				textarray: "texts_uncorset",
				textdata: {
                    serverID: interaction.guildId, 
					interactionuser: interaction.user,
					targetuser: corsetuser,
					c1: getHeavy(interaction.guildId, interaction.user.id)?.displayname, // heavy bondage type
					c2: getBaseCorset(getCorset(interaction.guildId, corsetuser.id)?.type)?.name ?? "Leather Corset", // corset type
				},
			};

			if (!getHeavyBound(interaction.guildId, interaction.user.id, corsetuser.id)) {
				// User is in heavy bondage
				data.heavy = true;
				if (corsetuser == interaction.user) {
					// Working with ourselves!
					data.self = true;
					if (getCorset(interaction.guildId, corsetuser.id)) {
						// We are wearing a corset!
						data.corset = true;
						interaction.reply(getText(data));
					} else {
						// We're not in a corset
						data.nocorset = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				} else {
					// Working with others
					data.other = true;
					if (getCorset(interaction.guildId, corsetuser.id)) {
						// They are wearing a corset!
						data.corset = true;
						interaction.reply(getText(data));
					} else {
						// They're not in a corset
						data.nocorset = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				}
			} else {
				// User is not in heavy bondage
				data.noheavy = true;
				if (corsetuser == interaction.user) {
					// Working with ourselves!
					data.self = true;
					if (getCorset(interaction.guildId, corsetuser.id)) {
						// We are wearing a corset!
						data.corset = true;
                        if (getCorset(interaction.guildId, corsetuser.id)?.lock && !canRemoveLock(interaction.guildId, corsetuser.id, interaction.user.id, getCorset(interaction.guildId, corsetuser.id).lock.uuid)) {
                            // The corset is locked and we aren't permitted to remove it 
                            data.noaccess = true;
                            interaction.reply(getText(data));
                        }
                        else if (getCorset(interaction.guildId, corsetuser.id)?.lock) {
                            // Locked, but we have the ability to remove it. 
                            data.locked = true;
                            interaction.reply(getText(data));
                            removeCorset(interaction.guildId, corsetuser.id);
                        }
                        else {
                            // Corset is NOT locked, so it can just be removed. 
                            data.nolocked = true;
                            interaction.reply(getText(data));
                            removeCorset(interaction.guildId, corsetuser.id);
                        }
					} else {
						// We're not in a corset
						data.nocorset = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				} else {
					// Working with others
					data.other = true;
					if (getCorset(interaction.guildId, corsetuser.id)) {
						// They are wearing a corset!
						data.corset = true;
						if (getCorset(interaction.guildId, corsetuser.id)?.lock && !canRemoveLock(interaction.guildId, corsetuser.id, interaction.user.id, getCorset(interaction.guildId, corsetuser.id).lock.uuid)) {
                            // The corset is locked and we aren't permitted to remove it 
                            data.noaccess = true;
                            interaction.reply(getText(data));
                        }
                        else if (getCorset(interaction.guildId, corsetuser.id)?.lock) {
                            // Locked, but we have the ability to remove it. 
                            data.locked = true;
                            interaction.reply(getText(data));
                            removeCorset(interaction.guildId, corsetuser.id);
                        }
                        else {
                            // Corset is NOT locked, so it can just be removed. 
                            data.nolocked = true;
                            interaction.reply(getText(data));
                            removeCorset(interaction.guildId, corsetuser.id);
                        }
					} else {
						// They're not in a corset
						data.nocorset = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
};
