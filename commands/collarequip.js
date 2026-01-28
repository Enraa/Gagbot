const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { getHeavy, assignHeavy, commandsheavy, convertheavy, heavytypes, getBaseHeavy } = require("./../functions/heavyfunctions.js");
const { getCollar, getCollarPerm, canAccessCollar } = require("./../functions/collarfunctions.js");
const { getChastity, assignChastity, getChastityName, getChastityBraName, } = require("./../functions/vibefunctions.js");
const { getMittenName, assignMitten, getMitten, mittentypes } = require("./../functions/gagfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent, handleExtremeRestraint } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { getChastityBra } = require("../functions/vibefunctions.js");
const { assignChastityBra } = require("../functions/vibefunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("collarequip")
		.setDescription(`Put chastity, mittens or heavy bondage on someone with a collar`)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("mittens")
				.setDescription("Apply Mittens...")
				.addUserOption((opt) => opt.setName("user").setDescription("To who?").setRequired(true))
				.addStringOption((opt) => opt.setName("type").setDescription("What flavor of helpless mittens to wear...").setAutocomplete(true)),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("heavy")
				.setDescription("Apply Heavy Bondage...")
				.addUserOption((opt) => opt.setName("user").setDescription("To who?").setRequired(true))
				.addStringOption((opt) => opt.setName("type").setDescription("Which Restraint?").setAutocomplete(true)),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("chastity")
				.setDescription("Apply Chastity...")
				.addUserOption((opt) => opt.setName("user").setDescription("To who?").setRequired(true))
				.addUserOption((opt) => opt.setName("keyholder").setDescription("Who should be the keyholder?"))
				.addStringOption((opt) => opt.setName("braorbelt").setDescription("Chastity belt or bra?").setChoices({ name: "Chastity Belt", value: "chastitybelt" }, { name: "Chastity Bra", value: "chastitybra" }))
				.addStringOption((opt) => opt.setName("type").setDescription("What flavor of cruel chastity to wear...").setAutocomplete(true)),
		),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const subc = interaction.options.getSubcommand();
		// /collarequip heavy .......
		if (subc == "heavy") {
			if (focusedValue == "") {
				// User hasn't entered anything, lets give them a suggested set of 10
				let heaviestoreturn = [
					{ name: "Latex Armbinder", value: "armbinder_latex" },
					{ name: "Shadow Latex Armbinder", value: "armbinder_shadowlatex" },
					{ name: "Wolfbinder", value: "armbinder_wolf" },
					{ name: "Ancient Armbinder", value: "armbinder_ancient" },
					{ name: "High Security Armbinder", value: "armbinder_secure" },
					{ name: "Latex Boxbinder", value: "boxbinder_latex" },
					{ name: "Comfy Straitjacket", value: "straitjacket_comfy" },
					{ name: "Maid Straitjacket", value: "straitjacket_maid" },
					{ name: "Doll Straitjacket", value: "straitjacket_doll" },
					{ name: "Shadow Latex Petsuit", value: "petsuit_shadowlatex" },
				];
				await interaction.respond(heaviestoreturn);
			} else {
				let heavies = process.heavytypes.filter((f) => f.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 10);
				await interaction.respond(heavies);
			}
		} else if (subc == "mittens") {
			if (focusedValue == "") {
				// User hasn't entered anything, lets give them a suggested set of 10
				let mittenstoreturn = mittentypes.slice(0, 10);
				await interaction.respond(mittenstoreturn);
			} else {
				try {
					let mittens = mittentypes.filter((f) => f.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 10);
					await interaction.respond(mittens);
				} catch (err) {
					console.log(err);
				}
			}
		} else if (subc == "chastity") {
			let beltorbra = interaction.options.get("braorbelt")?.value ?? "chastitybelt"; // Note we can only retrieve the user ID here!
			let optionstouse = beltorbra == "chastitybelt" ? process.autocompletes.chastitybelt : process.autocompletes.chastitybra;
			if (focusedValue == "") {
				// User hasn't entered anything, lets give them a suggested set of 10
				let chastitytoreturn = optionstouse.slice(0, 10);
				await interaction.respond(chastitytoreturn);
			} else {
				try {
					let chastitytoreturn = optionstouse.filter((f) => f.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 10);
					await interaction.respond(chastitytoreturn);
				} catch (err) {
					console.log(err);
				}
			}
		}
	},
	async execute(interaction) {
		try {
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			// List all heavy restraints if this is set.
			if (interaction.options.getBoolean("list_all_restraints")) {
				let restraints = heavytypes
					.map((h) => {
						return h.name;
					})
					.sort();
				let outtext = "## Full list of Heavy Restraints:\n\n";
				for (let i = 0; i < restraints.length; i++) {
					outtext = `${outtext}${restraints[i]}\n`;
				}
				await interaction.reply({ content: `${outtext}`, flags: MessageFlags.Ephemeral });
				return;
			}
			let actiontotake = interaction.options.getSubcommand();
			let collareduser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
			let bondagetype = interaction.options.getString("type");
			let keyholderuser = interaction.options.getUser("keyholder") ? interaction.options.getUser("keyholder") : interaction.user;
			let braorbelt = interaction.options.getString("braorbelt") ?? "chastitybelt";

			let bondagetypenotchosen = false;
			if (!bondagetype) {
				bondagetypenotchosen = true;
				if (actiontotake == "heavy") {
					bondagetype = "armbinder_latex";
				} else if (actiontotake == "mittens") {
					bondagetype = "mittens_latex";
				} else if (actiontotake == "chastity") {
					if (braorbelt == "chastitybelt") {
						bondagetype = "belt_silver";
					} else {
						bondagetype = "bra_silver";
					}
				}
			}

			// Build data tree:
			let data = {
				textarray: "texts_collarequip",
				textdata: {
					interactionuser: interaction.user,
					targetuser: collareduser,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: getHeavy(collareduser.id)?.type, // collar wearer's heavy bondage type
					c3: "", // New heavy bondage
					c4: `<@${getChastity(collareduser.id)?.keyholder}>`, // collar wearer's chastity keyholder
					c5: keyholderuser, // new chastity belt keyholder, if any
				},
			};

			if (actiontotake == "heavy") {
				// This SHOULD retrieve a custom name if any.
				if (getBaseHeavy(bondagetype) && getBaseHeavy(bondagetype).namefunction) {
					data = await getBaseHeavy(bondagetype).namefunction(interaction, data);
				} else {
					data.textdata.c3 = convertheavy(bondagetype);
				}
			} else if (actiontotake == "mittens") {
				data.textdata.c3 = getMittenName(interaction.user.id, bondagetype);
			} else if (actiontotake == "chastity") {
				if (braorbelt == "chastitybelt") {
					data.textdata.c3 = getChastityName(interaction.user.id, bondagetype);
				} else {
					data.textdata.c3 = getChastityBraName(interaction.user.id, bondagetype);
				}
			}

			if (data.textdata.c3 == undefined) {
				// Jesus christ please just DONT BE UNDEFINED
				// and ACTUALLY CHOOSE SOMETHING
				data.textdata.c3 = "Latex Armbinder";
				bondagetype = "armbinder_latex";
			}

			console.log(bondagetype);
			console.log(!bondagetype);
			console.log(bondagetypenotchosen);
			console.log(!bondagetypenotchosen);

			if (getHeavy(interaction.user.id)) {
				data.heavy = true;
				interaction.reply(getText(data));
			} else if (collareduser == interaction.user) {
				// Don't be cheeky.
				data.noheavy = true;
				data.tryingself = true;
				interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
			} else if (getCollar(collareduser.id)) {
				data.noheavy = true;
				data.collar = true;
				if (canAccessCollar(collareduser.id, interaction.user.id).access) {
					// Either we're a keyholder or it's a free use collar.
					data.key = true;
					if (actiontotake == "mittens") {
						data.mitten = true;
						if (bondagetypenotchosen == false) {
							data.namedmitten = true;
							if (getCollarPerm(collareduser.id, "mitten")) {
								if (getMitten(collareduser.id)) {
									data.alreadyworn = true;
									interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
								} else {
									data.allowed = true;
									interaction.reply(getText(data));
									assignMitten(collareduser.id, bondagetype);
								}
							} else {
								data.notallowed = true;
								interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
							}
						} else {
							data.nonamedmitten = true;
							if (getCollarPerm(collareduser.id, "mitten")) {
								if (getMitten(collareduser.id)) {
									data.alreadyworn = true;
									interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
								} else {
									data.allowed = true;
									interaction.reply(getText(data));
									assignMitten(collareduser.id);
								}
							} else {
								data.notallowed = true;
								interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
							}
						}
					} else if (actiontotake == "heavy") {
						data.heavybondage = true;
						if (getCollarPerm(collareduser.id, "heavy")) {
							if (getHeavy(collareduser.id)) {
								data.alreadyworn = true;
								interaction.reply({ content: `${collareduser} is already in bondage, wearing a ${getHeavy(collareduser.id).type}!`, flags: MessageFlags.Ephemeral });
							} else {
								data.allowed = true;
								await interaction.deferReply({ flags: MessageFlags.Ephemeral });
								await handleExtremeRestraint(interaction.user, collareduser, "heavy", bondagetype).then(
									async (success) => {
										await interaction.followUp({ content: `Equipping ${convertheavy(bondagetype)} onto ${collareduser}!`, withResponse: true });
										await interaction.followUp(getText(data));
										assignHeavy(collareduser.id, bondagetype, interaction.user.id, data.textdata.c3 != convertheavy(bondagetype) ? data.textdata.c3 : undefined);
									},
									async (reject) => {
										let nomessage = `${collareduser} rejected the ${convertheavy(bondagetype)}.`;
										if (reject == "Disabled") {
											nomessage = `${convertheavy(bondagetype)} is currently disabled in ${collareduser}'s Extreme options.`;
										}
										if (reject == "Error") {
											nomessage = `Something went wrong - Submit a bug report!`;
										}
										if (reject == "NoDM") {
											nomessage = `Something went wrong sending a DM to ${collareduser}, or ${collareduser} has DMs from this server disabled. Cannot obtain consent for this restraint.`;
										}
										await interaction.followUp(nomessage);
									},
								);
							}
						} else {
							data.notallowed = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					} else if (actiontotake == "chastity") {
						data.chastity = true;
						if (getCollarPerm(collareduser.id, "chastity")) {
							if (braorbelt == "chastitybelt") {
								// Trying to put a chastity belt on them
								data[braorbelt] = true;
								if (bondagetypenotchosen == false) {
									data.namedchastity = true;
									if (getChastity(collareduser.id)) {
										// Cant equip it on them
										data.alreadyworn = true;
										interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
									} else {
										// we can equip this on them
										data.allowed = true;
										if (keyholderuser == interaction.user) {
											data.key_self = true;
											interaction.reply(getText(data));
											assignChastity(collareduser.id, keyholderuser.id, bondagetype);
										} else {
											data.key_other = true;
											interaction.reply(getText(data));
											assignChastity(collareduser.id, keyholderuser.id, bondagetype);
										}
									}
								} else {
									data.nonamedchastity = true;
									if (getChastity(collareduser.id)) {
										// Cant equip it on them
										data.alreadyworn = true;
										interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
									} else {
										// we can equip this on them
										data.allowed = true;
										if (keyholderuser == interaction.user) {
											data.key_self = true;
											interaction.reply(getText(data));
											assignChastity(collareduser.id, keyholderuser.id, bondagetype);
										} else {
											data.key_other = true;
											interaction.reply(getText(data));
											assignChastity(collareduser.id, keyholderuser.id, bondagetype);
										}
									}
								}
							} else {
								// Trying to put a chastity bra on them
								data[braorbelt] = true;
								if (bondagetypenotchosen == false) {
									data.namedchastity = true;
									if (getChastityBra(collareduser.id)) {
										// Cant equip it on them
										data.alreadyworn = true;
										interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
									} else {
										// we can equip this on them
										data.allowed = true;
										if (keyholderuser == interaction.user) {
											data.key_self = true;
											interaction.reply(getText(data));
											assignChastityBra(collareduser.id, keyholderuser.id, bondagetype);
										} else {
											data.key_other = true;
											interaction.reply(getText(data));
											assignChastityBra(collareduser.id, keyholderuser.id, bondagetype);
										}
									}
								} else {
									data.nonamedchastity = true;
									if (getChastityBra(collareduser.id)) {
										// Cant equip it on them
										data.alreadyworn = true;
										interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
									} else {
										// we can equip this on them
										data.allowed = true;
										if (keyholderuser == interaction.user) {
											data.key_self = true;
											interaction.reply(getText(data));
											assignChastityBra(collareduser.id, keyholderuser.id, bondagetype);
										} else {
											data.key_other = true;
											interaction.reply(getText(data));
											assignChastityBra(collareduser.id, keyholderuser.id, bondagetype);
										}
									}
								}
							}
						} else {
							data.notallowed = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					}
				} else {
					data.nokey = true;
					// We don't have permission to play with that collar.
					interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
				}
			} else {
				// They aren't wearing a collar.
				data.noheavy = true;
				data.nocollar = true;
				interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
			}
		} catch (err) {
			console.log(err);
		}
	},
};
