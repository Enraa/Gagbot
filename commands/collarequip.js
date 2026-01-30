const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { getHeavy, assignHeavy, commandsheavy, convertheavy, heavytypes, getBaseHeavy } = require("./../functions/heavyfunctions.js");
const { getCollar, getCollarPerm, canAccessCollar } = require("./../functions/collarfunctions.js");
const { getChastity, assignChastity, getChastityName, getChastityBraName, } = require("./../functions/vibefunctions.js");
const { getMittenName, assignMitten, getMitten, mittentypes, getBaseMitten } = require("./../functions/gagfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent, handleExtremeRestraint } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { getChastityBra } = require("../functions/vibefunctions.js");
const { assignChastityBra } = require("../functions/vibefunctions.js");
const { getBaseChastity } = require("../functions/chastityfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getUserTags } = require("../functions/configfunctions.js");

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
        try {
            const subc = interaction.options.getSubcommand();
            let chosenuserid = interaction.options.get("user")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
            if (subc == "heavy") {
                const focusedValue = interaction.options.getFocused();
                let autocompletes = process.heavytypes;
                let matches = didYouMean(focusedValue, autocompletes, {
                    matchPath: ['name'], 
                    returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                    threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
                })
                
                if (matches.length == 0) {
                    matches = autocompletes;
                }
                let tags = getUserTags(chosenuserid);
                let newsorted = [];
                matches.forEach((f) => {
                    let tagged = false;
                    let i = getBaseHeavy(f.value)
                    tags.forEach((t) => {
                        if (i.tags && (Array.isArray(i.tags)) && i.tags.includes(t)) { tagged = true }
                        else if (i.tags && (i.tags[t])) { tagged = true }
                    })
                    if (!tagged) {
                        newsorted.push(f);
                    }
                })
                interaction.respond(newsorted.slice(0,25))
            } else if (subc == "mittens") {
                const focusedValue = interaction.options.getFocused();
                let autocompletes = process.autocompletes.mitten;
                let matches = didYouMean(focusedValue, autocompletes, {
                    matchPath: ['name'], 
                    returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                    threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
                })
                
                if (matches.length == 0) {
                    matches = autocompletes;
                }
                let tags = getUserTags(chosenuserid);
                let newsorted = [];
                matches.forEach((f) => {
                    let tagged = false;
                    let i = getBaseMitten(f.value)
                    tags.forEach((t) => {
                        if (i.tags && (Array.isArray(i.tags)) && i.tags.includes(t)) { tagged = true }
                        else if (i.tags && (i.tags[t])) { tagged = true }
                    })
                    if (!tagged) {
                        newsorted.push(f);
                    }
                })
                interaction.respond(newsorted.slice(0,25))
            } else if (subc == "chastity") {
                const focusedValue = interaction.options.getFocused();
                let beltorbra = interaction.options.get("braorbelt")?.value ?? "chastitybelt";
                let autocompletes = process.autocompletes[beltorbra];
                let matches = didYouMean(focusedValue, autocompletes, {
                    matchPath: ['name'], 
                    returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                    threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
                })
                
                if (matches.length == 0) {
                    matches = autocompletes;
                }
                let tags = getUserTags(chosenuserid);
                let newsorted = [];
                matches.forEach((f) => {
                    let tagged = false;
                    let i = getBaseChastity(f.value)
                    tags.forEach((t) => {
                        if (i.tags && (Array.isArray(i.tags)) && i.tags.includes(t)) { tagged = true }
                        else if (i.tags && (i.tags[t])) { tagged = true }
                    })
                    if (!tagged) {
                        newsorted.push(f);
                    }
                })
                interaction.respond(newsorted.slice(0,25))
            }
        }
		catch (err) {
            console.log(err);
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

            // Check if the wearer is okay with it. If they aren't, error.
            if (actiontotake == "heavy") {
                if (bondagetype) {
                    let tags = getUserTags(collareduser.id);
                    let i = getBaseHeavy(bondagetype)
                    tags.forEach((t) => {
                        if (i && i.tags && i.tags.includes(t) && (collareduser != interaction.user)) {
                            interaction.reply({ content: `${collareduser}'s content settings forbid this item - ${i.name}!`, flags: MessageFlags.Ephemeral })
                            return;
                        }
                    })
                }
            }
            else if (actiontotake == "mittens") {
                if (bondagetype) {
                    let tags = getUserTags(collareduser.id);
                    let i = getBaseMitten(bondagetype)
                    tags.forEach((t) => {
                        if (i && i.tags && i.tags.includes(t) && (collareduser != interaction.user)) {
                            interaction.reply({ content: `${collareduser}'s content settings forbid this item - ${i.name}!`, flags: MessageFlags.Ephemeral })
                            return;
                        }
                    })
                }
            }
            else if (actiontotake == "chastity") {
                if (bondagetype) {
                    let tags = getUserTags(collareduser.id);
                    let i = getBaseChastity(bondagetype)
                    tags.forEach((t) => {
                        if (i && i.tags && i.tags.includes(t) && (collareduser != interaction.user)) {
                            interaction.reply({ content: `${collareduser}'s content settings forbid this item - ${i.name}!`, flags: MessageFlags.Ephemeral })
                            return;
                        }
                    })
                }
            }

			let bondagetypenotchosen = false;
			if (!bondagetype) {
				bondagetypenotchosen = true;
				if (actiontotake == "heavy") {
					bondagetype = "armbinder_latex";
				} else if (actiontotake == "mittens") {
					bondagetype = undefined;
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
                if (actiontotake == "heavy") {
                    data.textdata.c3 = "Latex Armbinder";
				    bondagetype = "armbinder_latex";
                } else if (actiontotake == "mittens") {
                    data.textdata.c3 = "mittens";
				    bondagetype = undefined;
                } else if (actiontotake == "chastity") {
                    if (braorbelt == "chastitybelt") {
                        data.textdata.c3 = "chastity belt";
				        bondagetype = "belt_silver";
                    } else {
                        data.textdata.c3 = "chastity bra";
				        bondagetype = "bra_chastity";
                    }
                }
			}

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
    async help(userid, page) {
        //let restrictedtext = (getCollar(userid) && !canAccessCollar(userid, userid, true).access) ? `***You cannot unlock your collar currently***\n` : ""
        let overviewtext = `## Collarequip
### Usage: /collarequip subcommand (user) (type) (keyholder)
-# Restricted if not holding the user's collar key

Applies **Mittens**, **Chastity** or **Heavy Bondage** to a wearer if their collar's permissions allow them, commands normally restricted to self only. Chastity applied this way is permanent as if the wearer applied the chastity themself, including if you designate a keyholder.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
