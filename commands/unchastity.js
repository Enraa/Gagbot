const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { calculateTimeout } = require("./../functions/timefunctions.js");
const { handleConsent } = require("./../functions/interactivefunctions.js");
const { rollKeyFumble } = require("../functions/keyfindingfunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { config } = require("../functions/configfunctions.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { getHeavy } = require("../functions/getters/heavy/getHeavy.js");
const { getHeavyBound } = require("../functions/getters/heavy/getHeavyBound.js");
const { getChastity } = require("../functions/getters/chastity/getChastity.js");
const { getBaseChastity } = require("../functions/getters/chastity/getBaseChastity.js");
const { removeChastity } = require("../functions/setters/chastity/removeChastity.js");
const { getOption } = require("../functions/getters/config/getOption.js");
const { getChastityBra } = require("../functions/getters/chastity/getChastityBra.js");
const { removeChastityBra } = require("../functions/setters/chastity/removeChastityBra.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unchastity")
		.setDescription("Remove a chastity belt from someone")
        .addUserOption((opt) => opt.setName("wearer").setDescription("Who to unlock..."))
		.addStringOption((opt) => opt.setName("braorbelt").setDescription("Chastity belt or bra?").setChoices({ name: "Chastity Belt", value: "chastitybelt" }, { name: "Chastity Bra", value: "chastitybra" })),
	async execute(interaction) {
		try {
			let chastitywearer = interaction.options.getUser("wearer") ? interaction.options.getUser("wearer") : interaction.user;
			let braorbelt = interaction.options.getString("braorbelt") ?? "chastitybelt";
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			// Build data tree:
			let data = {
				textarray: "texts_unchastity",
				textdata: {
					interactionuser: interaction.user,
					targetuser: chastitywearer,
					c1: getHeavy(interaction.user.id)?.displayname, // heavy bondage type
				},
			};

			data[braorbelt] = true;
			if (braorbelt == "chastitybelt") {
				// Trying to take off a chastity belt
				if (!getHeavyBound(interaction.user.id, chastitywearer.id)) {
					// In heavy bondage, cannot take off the belt anyway
					data.heavy = true;
					if (chastitywearer == interaction.user) {
						// trying to take off own belt
						data.self = true;
						if (getChastity(interaction.user.id)) {
							// in chastity
							data.chastity = true;
							interaction.reply(getText(data));
						} else {
							// User is in some form of heavy bondage and wouldn't be able to remove it anyway
							data.nochastity = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					} else {
						data.other = true;
						if (getChastity(interaction.user.id)) {
							data.chastity = true;
							interaction.reply(getText(data));
						} else {
							// User is in some form of heavy bondage and cannot put on a chastity belt
							data.nochastity = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					}
				}
				// What the fuck was my logic here
				// Anyway, rewritten unchastity logic
				else {
					// Not in heavy bondage
					data.noheavy = true;
					if (chastitywearer == interaction.user) {
						// This is ourselves
						data.self = true;
						if (getChastity(chastitywearer.id)) {
							// We are in chastity
							data.chastity = true;
							if (getBaseChastity(getChastity(chastitywearer.id).chastitytype ?? "belt_silver").canUnequip({ userID: chastitywearer.id, keyholderID: interaction.user.id })) {
								// We have the key to our belt
								data.key = true;
								const fumbleResult = getBaseChastity(getChastity(chastitywearer.id).chastitytype ?? "belt_silver").fumble({ userID: chastitywearer.id, keyholderID: interaction.user.id })
								if (fumbleResult > 0) {
									// We fumbled
									data.fumble = true;
									if ((getOption(chastitywearer.id, "keyloss") == "enabled") && fumbleResult > 1) {
										// We lost the key
										data.discard = true;
										let discardresult = getBaseChastity(getChastity(chastitywearer.id).chastitytype ?? "belt_silver").discard({ userID: chastitywearer.id, keyholderID: interaction.user.id })
										data[discardresult] = true;
										interaction.reply(getText(data));
									} else {
										data.nodiscard = true;
										interaction.reply(getText(data));
									}
								} else {
									// We didnt lose the keys
									data.nofumble = true;
									interaction.reply(getText(data));
									removeChastity(chastitywearer.id, interaction.user.id);
								}
							} else {
								// We don't have the keys
								data.nokey = true;
								interaction.reply(getText(data));
							}
						} else {
							// We aren't in chastity
							data.nochastity = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					} else {
						// This is someone else
						data.other = true;
						if (getChastity(chastitywearer.id)) {
							// They are in chastity
							data.chastity = true;
							if (getBaseChastity(getChastity(chastitywearer.id).chastitytype ?? "belt_silver").canUnequip({ userID: chastitywearer.id, keyholderID: interaction.user.id })) {
								// We have their chastity key
								data.key = true;
								const fumbleResult = getBaseChastity(getChastity(chastitywearer.id).chastitytype ?? "belt_silver").fumble({ userID: chastitywearer.id, keyholderID: interaction.user.id })
								if (fumbleResult > 0) {
									// We fumbled the key
									data.fumble = true;
									if ((getOption(chastitywearer.id, "keyloss") == "enabled") && fumbleResult > 1) {
										// We lost the key
										data.discard = true;
										let discardresult = getBaseChastity(getChastity(chastitywearer.id).chastitytype ?? "belt_silver").discard({ userID: chastitywearer.id, keyholderID: interaction.user.id })
										data[discardresult] = true;
										interaction.reply(getText(data));
									} else {
										data.nodiscard = true;
										interaction.reply(getText(data));
									}
								} else {
									// did not fumble!
									data.nofumble = true;
									interaction.reply(getText(data));
									removeChastity(chastitywearer.id, interaction.user.id);
								}
							} else {
								// We don't have their chastity key
								data.nokey = true;
								interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
							}
						} else {
							// They aren't in a chastity belt
							data.nochastity = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					}
				}
			} else {
				// Trying to take off a chastity bra
				if (!getHeavyBound(interaction.user.id, chastitywearer.id)) {
					// In heavy bondage, cannot take off the belt anyway
					data.heavy = true;
					if (chastitywearer == interaction.user) {
						// trying to take off own belt
						data.self = true;
						if (getChastityBra(interaction.user.id)) {
							// in chastity
							data.chastity = true;
							interaction.reply(getText(data));
						} else {
							// User is in some form of heavy bondage and wouldn't be able to remove it anyway
							data.nochastity = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					} else {
						data.other = true;
						if (getChastityBra(interaction.user.id)) {
							data.chastity = true;
							interaction.reply(getText(data));
						} else {
							// User is in some form of heavy bondage and cannot put on a chastity belt
							data.nochastity = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					}
				}
				// What the fuck was my logic here
				// Anyway, rewritten unchastity logic
				else {
					// Not in heavy bondage
					data.noheavy = true;
					if (chastitywearer == interaction.user) {
						// This is ourselves
						data.self = true;
						if (getChastityBra(chastitywearer.id)) {
							// We are in chastity
							data.chastity = true;
							if (getBaseChastity(getChastityBra(chastitywearer.id).chastitytype ?? "bra_silver").canUnequip({ userID: chastitywearer.id, keyholderID: interaction.user.id })) {
								// We have the key to our belt
								data.key = true;
								const fumbleResult = getBaseChastity(getChastityBra(chastitywearer.id).chastitytype ?? "bra_silver").fumble({ userID: chastitywearer.id, keyholderID: interaction.user.id })
								if (fumbleResult > 0) {
									// We fumbled
									data.fumble = true;
									if ((getOption(chastitywearer.id, "keyloss") == "enabled") && fumbleResult > 1) {
										// We lost the key
										data.discard = true;
										let discardresult = getBaseChastity(getChastityBra(chastitywearer.id).chastitytype ?? "bra_silver").discard({ userID: chastitywearer.id, keyholderID: interaction.user.id })
										data[discardresult] = true;
										interaction.reply(getText(data));
									} else {
										data.nodiscard = true;
										interaction.reply(getText(data));
									}
								} else {
									// We didnt lose the keys
									data.nofumble = true;
									interaction.reply(getText(data));
									removeChastityBra(chastitywearer.id, interaction.user.id);
								}
							} else {
								// We don't have the keys
								data.nokey = true;
								interaction.reply(getText(data));
							}
						} else {
							// We aren't in chastity
							data.nochastity = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					} else {
						// This is someone else
						data.other = true;
						if (getChastityBra(chastitywearer.id)) {
							// They are in chastity
							data.chastity = true;
							if (getBaseChastity(getChastityBra(chastitywearer.id).chastitytype ?? "bra_silver").canUnequip({ userID: chastitywearer.id, keyholderID: interaction.user.id })) {
								// We have their chastity key or otherwise have access
								data.key = true;
								const fumbleResult = getBaseChastity(getChastityBra(chastitywearer.id).chastitytype ?? "bra_silver").fumble({ userID: chastitywearer.id, keyholderID: interaction.user.id })
								if (fumbleResult > 0) {
									// We fumbled the key
									data.fumble = true;
									if ((getOption(chastitywearer.id, "keyloss") == "enabled") && fumbleResult > 1) {
										// We lost the key
										data.discard = true;
										let discardresult = getBaseChastity(getChastityBra(chastitywearer.id).chastitytype ?? "bra_silver").discard({ userID: chastitywearer.id, keyholderID: interaction.user.id })
										data[discardresult] = true;
										interaction.reply(getText(data));
									} else {
										data.nodiscard = true;
										interaction.reply(getText(data));
									}
								} else {
									// did not fumble!
									data.nofumble = true;
									interaction.reply(getText(data));
									removeChastityBra(chastitywearer.id, interaction.user.id);
								}
							} else {
								// We don't have their chastity key
								data.nokey = true;
								interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
							}
						} else {
							// They aren't in a chastity belt
							data.nochastity = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
};
