const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { getChastity, getVibe, assignVibe, discardChastityKey, canAccessChastity } = require("./../functions/vibefunctions.js");
const { getHeavy } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent } = require("./../functions/interactivefunctions.js");
const { getCorset, assignCorset, getBaseCorset } = require("./../functions/corsetfunctions.js");
const { rollKeyFumble } = require("../functions/keyfindingfunctions.js");
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");
const { checkBondageRemoval, handleBondageRemoval } = require("../functions/interactivefunctions.js");
const { config } = require("../functions/configfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getUserTags } = require("../functions/configfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("corset")
		.setDescription("Put a corset on someone, shortening their messages")
		.addUserOption((opt) => opt.setName("user").setDescription("Who to corset?"))
		.addNumberOption((opt) => opt.setName("intensity").setDescription("How tightly to lace their corset!").setMinValue(1).setMaxValue(10))
		.addStringOption((opt) => opt.setName("type").setDescription("Which type of corset").setAutocomplete(true)),
    async autoComplete(interaction) {
		try {
            const focusedValue = interaction.options.getFocused();
            let autocompletes = process.autocompletes.corset;
            let matches = didYouMean(focusedValue, autocompletes, {
                matchPath: ['name'], 
                returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
            })
            
            if (matches.length == 0) {
                matches = autocompletes;
            }
            let tags = getUserTags(interaction.user.id);
            let newsorted = [];
            matches.forEach((f) => {
                let tagged = false;
                let i = getBaseCorset(f.value)
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
        catch (err) {
            console.log(err);
        }
	},
    async execute(interaction) {
		try {
			let corsetuser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(corsetuser.id)?.mainconsent) {
				await handleConsent(interaction, corsetuser.id);
				return;
			}
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			const current = getCorset(corsetuser.id);
			const tightness = interaction.options.getNumber("intensity") ?? current?.tightness ?? 5;
			const type = interaction.options.getString("type") ?? current?.type ?? "corset_leather";
			// Build data tree:
			let data = {
				textarray: "texts_corset",
				textdata: {
					interactionuser: interaction.user,
					targetuser: corsetuser,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: tightness, // corset tightness
					c3: getBaseCorset(current?.type)?.name ?? "Leather Corset", // current corset
					c4: getBaseCorset(type)?.name ?? "Leather Corset", // new corset
				},
			};
			// REFLECT
			if (corsetuser.id == process.client.user.id) {
				data.gagreflect = true;
				data.textdata.interactionuser = process.client.user;
				data.textdata.targetuser = interaction.user;
				interaction.reply({ content: `Gagbot recognizes what you're attempting to do. Cheeky.`, flags: MessageFlags.Ephemeral });
				return;
			}
			if (getHeavy(interaction.user.id)) {
				// In heavy bondage, fail
				data.heavy = true;
				if (corsetuser == interaction.user) {
					// Doing this to self
					data.self = true;
					if (getChastity(corsetuser.id)) {
						data.chastity = true;
						interaction.reply(getText(data));
					} else {
						data.nochastity = true;
						interaction.reply(getText(data));
					}
				} else {
					// To others
					data.other = true;
					if (getChastity(corsetuser.id)) {
						data.chastity = true;
						interaction.reply(getText(data));
					} else {
						data.nochastity = true;
						interaction.reply(getText(data));
					}
				}
			} else if (getChastity(corsetuser.id)) {
				data.noheavy = true;
				data.chastity = true;
				// The target is in a chastity belt
				if (canAccessChastity(corsetuser.id, interaction.user.id).access) {
					// User tries to modify the corset settings for someone in chastity that they do have the key for
					data.key = true;
					const fumbleResult = rollKeyFumble(interaction.user.id, corsetuser.id, 2);
					if (fumbleResult > 0) {
						// User fumbles with the key due to their arousal and frustration
						data.fumble = true;
						if (config.getKeyLoss(corsetuser.id) && fumbleResult > 1) {
							data.discard = true;
							// if they fumble again they can lose the key
							if (corsetuser == interaction.user) {
								// User tries to modify their own corset settings while in chastity
								data.self = true;
								if (current) {
									// User already has a corset on
									data.corset = true;
									let discardresult = discardChastityKey(corsetuser.id, interaction.user.id);
									data[discardresult] = true;
									interaction.reply(getText(data));
								} else {
									// Putting ON a corset!
									data.nocorset = true;
									let discardresult = discardChastityKey(corsetuser.id, interaction.user.id);
									data[discardresult] = true;
									interaction.reply(getText(data));
								}
							} else {
								if (current) {
									// User already has a corset on
									data.corset = true;
									let discardresult = discardChastityKey(corsetuser.id, interaction.user.id);
									data[discardresult] = true;
									interaction.reply(getText(data));
								} else {
									// Putting ON a corset!
									data.nocorset = true;
									let discardresult = discardChastityKey(corsetuser.id, interaction.user.id);
									data[discardresult] = true;
									interaction.reply(getText(data));
								}
							}
						} else {
							data.nodiscard = true;
							if (corsetuser == interaction.user) {
								// User tries to modify their own corset settings while in chastity
								data.self = true;
								if (current) {
									// User already has a corset on
									data.corset = true;
									interaction.reply(getText(data));
								} else {
									// Putting ON a corset!
									data.nocorset = true;
									interaction.reply(getText(data));
								}
							} else {
								// User tries to modify another user's vibe settings
								data.other = true;
								if (current) {
									// User already has a corset on
									data.corset = true;
									interaction.reply(getText(data));
								} else {
									// Putting ON a corset!
									data.nocorset = true;
									interaction.reply(getText(data));
								}
							}
						}
					} else {
						data.nofumble = true;
						if (corsetuser == interaction.user) {
							data.self = true;
							// User tries to modify their own corset settings while in chastity
							if (current) {
								// User already has a corset on
								if (type != current.type) {
									data.newcorset = true;
									interaction.reply(getText(data));
									assignCorset(corsetuser.id, type, tightness);
								} else {
									data.corset = true;
									if (current.tightness < tightness) {
										// Tightening the corset!
										data.tighter = true;
										interaction.reply(getText(data));
										assignCorset(corsetuser.id, type, tightness);
									} else {
										// Loosening the corset!
										data.looser = true;
										interaction.reply(getText(data));
										assignCorset(corsetuser.id, type, tightness);
									}
								}
							} else {
								// Putting ON a corset!
								data.nocorset = true;
								interaction.reply(getText(data));
								assignCorset(corsetuser.id, type, tightness);
							}
						} else {
							// User tries to modify another user's vibe settings
							data.other = true;
							if (current) {
								// User already has a corset on
								if (type != current.type) {
									data.newcorset = true;
									// Now lets make sure the wearer wants that.
									if (checkBondageRemoval(interaction.user.id, corsetuser.id, "corset") == true) {
										// Allowed immediately, lets go
										interaction.reply(getText(data));
										assignCorset(corsetuser.id, type, tightness, interaction.user.id);
									} else {
										// We need to ask first.
										let datatogeneric = Object.assign({}, data.textdata);
										datatogeneric.c1 = "corset";
										interaction.reply({ content: getTextGeneric("changebind", datatogeneric), flags: MessageFlags.Ephemeral });
										let canRemove = await handleBondageRemoval(interaction.user, corsetuser, "corset", true).then(
											async (res) => {
												await interaction.editReply(getTextGeneric("changebind_accept", datatogeneric));
												await interaction.followUp(getText(data));
												assignCorset(corsetuser.id, type, tightness, interaction.user.id);
											},
											async (rej) => {
												await interaction.editReply(getTextGeneric("changebind_decline", datatogeneric));
											},
										);
									}
									interaction.reply(getText(data));
									assignCorset(corsetuser.id, type, tightness);
								} else {
									data.corset = true;
									if (current.tightness < tightness) {
										// Tightening the corset!
										data.tighter = true;
										// Now lets make sure the wearer wants that.
										if (checkBondageRemoval(interaction.user.id, corsetuser.id, "corset") == true) {
											// Allowed immediately, lets go
											interaction.reply(getText(data));
											assignCorset(corsetuser.id, type, tightness, interaction.user.id);
										} else {
											// We need to ask first.
											let datatogeneric = Object.assign({}, data.textdata);
											datatogeneric.c1 = "corset";
											interaction.reply({ content: getTextGeneric("changebind", datatogeneric), flags: MessageFlags.Ephemeral });
											let canRemove = await handleBondageRemoval(interaction.user, corsetuser, "corset", true).then(
												async (res) => {
													await interaction.editReply(getTextGeneric("changebind_accept", datatogeneric));
													await interaction.followUp(getText(data));
													assignCorset(corsetuser.id, type, tightness, interaction.user.id);
												},
												async (rej) => {
													await interaction.editReply(getTextGeneric("changebind_decline", datatogeneric));
												},
											);
										}
									} else {
										// Loosening the corset!
										data.looser = true;
										interaction.reply(getText(data));
										assignCorset(corsetuser.id, type, tightness);
									}
								}
							} else {
								// Putting ON a corset!
								data.nocorset = true;
								interaction.reply(getText(data));
								assignCorset(corsetuser.id, type, tightness);
							}
						}
					}
				} else {
					data.noheavy = true;
					data.chastity = true;
					data.nokey = true;
					// User tries to modify corset settings but does not have the key for the belt
					if (corsetuser == interaction.user) {
						// User tries to modify their own corset settings while in chastity
						data.self = true;
						if (current) {
							// User already has a corset on
							data.corset = true;
							interaction.reply(getText(data));
						} else {
							data.nocorset = true;
							interaction.reply(getText(data));
						}
					} else {
						// User does not have others' belt key
						data.other = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				}
			} else {
				// Target is NOT in a chastity belt!
				data.noheavy = true;
				data.nochastity = true;
				if (corsetuser == interaction.user) {
					// User tries to add a corset to themselves
					data.self = true;
					if (current) {
						// User tries to modify their own corset settings while not in chastity.
						if (type != current.type) {
							data.newcorset = true;
							interaction.reply(getText(data));
							assignCorset(corsetuser.id, type, tightness);
						} else {
							data.corset = true;
							if (current.tightness < tightness) {
								// User is tightening the corset
								data.tighten = true;
								interaction.reply(getText(data));
								assignCorset(corsetuser.id, type, tightness);
							} else {
								// Loosening the corset
								data.loosen = true;
								interaction.reply(getText(data));
								assignCorset(corsetuser.id, type, tightness);
							}
						}
					} else {
						data.nocorset = true;
						interaction.reply(getText(data));
						assignCorset(corsetuser.id, type, tightness);
					}
				} else {
					data.other = true;
					// User tries to modify another user's vibe settings
					if (current) {
						// User tries to modify their someone else's corset while they're not in chastity
						if (type != current.type) {
							data.newcorset = true;
							// Now lets make sure the wearer wants that.
							if (checkBondageRemoval(interaction.user.id, corsetuser.id, "corset") == true) {
								// Allowed immediately, lets go
								interaction.reply(getText(data));
								assignCorset(corsetuser.id, type, tightness, interaction.user.id);
							} else {
								// We need to ask first.
								let datatogeneric = Object.assign({}, data.textdata);
								datatogeneric.c1 = "corset";
								interaction.reply({ content: getTextGeneric("changebind", datatogeneric), flags: MessageFlags.Ephemeral });
								let canRemove = await handleBondageRemoval(interaction.user, corsetuser, "corset").then(
									async (res) => {
										await interaction.editReply(getTextGeneric("changebind_accept", datatogeneric));
										await interaction.followUp(getText(data));
										assignCorset(corsetuser.id, type, tightness, interaction.user.id);
									},
									async (rej) => {
										await interaction.editReply(getTextGeneric("changebind_decline", datatogeneric));
									},
								);
							}
						} else {
							data.corset = true;
							if (current.tightness < tightness) {
								// Tightening
								data.tighten = true;
								// Now lets make sure the wearer wants that.
								if (checkBondageRemoval(interaction.user.id, corsetuser.id, "corset") == true) {
									// Allowed immediately, lets go
									interaction.reply(getText(data));
									assignCorset(corsetuser.id, type, tightness, interaction.user.id);
								} else {
									// We need to ask first.
									let datatogeneric = Object.assign({}, data.textdata);
									datatogeneric.c1 = "corset";
									interaction.reply({ content: getTextGeneric("changebind", datatogeneric), flags: MessageFlags.Ephemeral });
									let canRemove = await handleBondageRemoval(interaction.user, corsetuser, "corset").then(
										async (res) => {
											await interaction.editReply(getTextGeneric("changebind_accept", datatogeneric));
											await interaction.followUp(getText(data));
											assignCorset(corsetuser.id, type, tightness, interaction.user.id);
										},
										async (rej) => {
											await interaction.editReply(getTextGeneric("changebind_decline", datatogeneric));
										},
									);
								}
							} else {
								// Loosening
								data.loosen = true;
								// Now lets make sure the wearer wants that.
								if (checkBondageRemoval(interaction.user.id, corsetuser.id, "corset") == true) {
									// Allowed immediately, lets go
									interaction.reply(getText(data));
									assignCorset(corsetuser.id, type, tightness, interaction.user.id);
								} else {
									// We need to ask first.
									let datatogeneric = Object.assign({}, data.textdata);
									datatogeneric.c1 = "corset";
									interaction.reply({ content: getTextGeneric("changebind", datatogeneric), flags: MessageFlags.Ephemeral });
									let canRemove = await handleBondageRemoval(interaction.user, corsetuser, "corset").then(
										async (res) => {
											await interaction.editReply(getTextGeneric("changebind_accept", datatogeneric));
											await interaction.followUp(getText(data));
											assignCorset(corsetuser.id, type, tightness, interaction.user.id);
										},
										async (rej) => {
											await interaction.editReply(getTextGeneric("changebind_decline", datatogeneric));
										},
									);
								}
							}
						}
					} else {
						data.nocorset = true;
						interaction.reply(getText(data));
						assignCorset(corsetuser.id, type, tightness);
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
    async help(userid, page) {
        let restrictedtext = (getCorset(userid) && getChastity(userid) && !canAccessChastity(userid, userid).access) ? `***You cannot change or remove your corset currently***\n` : ""
        let overviewtext = `## Corset
### Usage: /corset (user) (tightness)
### Remove:  /uncorset (user)
-# Restricted if in a chastity belt without the key
${restrictedtext}
Places a tight **Corset** on the user, which limits their speech in various ways, reducing their ability to speak in capital letters until they are eventually only able to speak a few words at a time. **Breath** is consumed with each syllable and regenerates over time, slower at higher **Tightness** levels. When out of breath, the user is unable to speak.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
