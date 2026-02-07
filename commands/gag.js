const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { getGag, assignGag, getMitten, getGagLast } = require("./../functions/gagfunctions.js");
const { getHeavy } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent, handleExtremeRestraint } = require("./../functions/interactivefunctions.js");
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");
const { checkBondageRemoval, handleBondageRemoval } = require("../functions/interactivefunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getUserTags } = require("../functions/configfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("gag")
		.setDescription("Apply a gag to the user")
		.addUserOption((opt) => opt.setName("user").setDescription("The user to gag"))
		.addStringOption((opt) => opt.setName("gag").setDescription("Type of gag to use").setAutocomplete(true)
		)
		.addNumberOption((opt) => opt.setName("intensity").setDescription("How tightly to gag. Range 1-10").setMinValue(1).setMaxValue(10))
		.addStringOption((opt) => opt.setName("tone").setDescription("What tone to use for the RP output?").addChoices({ name: "Gentle", value: "gentle" }, { name: "Forceful", value: "forceful" }, { name: "Requesting", value: "requesting" })),
	async autoComplete(interaction) {
		try {
            const focusedValue = interaction.options.getFocused();
            let autocompletes = process.autocompletes.gag;
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
                let i = process.gagtypes[f.value]
                tags.forEach((t) => {
                    if (i.tags && (Array.isArray(i.tags)) && i.tags.includes(t)) { tagged = true }
                    else if (i.tags && (i.tags[t])) { tagged = true }
                })
                if (!tagged) {
                    newsorted.push(f);
                }
                else {
                    newsorted.push({ name: `${f.name} (Forbidden due to Content Preferences)`, value: f.value })
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
			let gaggeduser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(gaggeduser.id)?.mainconsent) {
				await handleConsent(interaction, gaggeduser.id);
				return;
			}
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let interactionuser = interaction.user;
			let gagtype = interaction.options.getString("gag") ? interaction.options.getString("gag") : "ball";
			let gagintensity = interaction.options.getNumber("intensity") ? interaction.options.getNumber("intensity") : 5;
			let currentgag = getGag(gaggeduser.id, gagtype);
			let gagname = process.gagtypes[gagtype]?.choicename;
			let oldgagname = process.gagtypes[getGagLast(gaggeduser.id)]?.choicename;
			let intensitytext = "loosely";
			if (intensitytext == "loosely") {
				if (gagintensity > 2) {
					intensitytext = "moderately loosely";
				}
				if (gagintensity > 4) {
					intensitytext = "moderately tightly";
				}
				if (gagintensity > 7) {
					intensitytext = "tightly";
				}
				if (gagintensity > 9) {
					intensitytext = "as tightly as possible";
				}
			}
            if (gagname && process.gagtypes[gagtype].intensityText) {
                intensitytext = process.gagtypes[gagtype].intensityText(gagintensity)
            }

			let tone = interaction.options.getString("tone");
			// Choose a random choice if the user did not choose.
			if (!tone) {
				let choices = ["gentle", "forceful", "requesting"];
				tone = choices[Math.floor(choices.length * Math.random())];
			}

			// Build data tree:
			let data = {
				textarray: "texts_gag",
				textdata: {
					interactionuser: interaction.user,
					targetuser: gaggeduser,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: intensitytext, // gag tightness
					c3: gagname, // New gag being put on the wearer
					c4: oldgagname, // Old gag the wearer has on
				},
			};

			if (data.textdata.c3 == undefined) {
				// Something went CRITICALLY wrong. Eject, eject!
				interaction.reply({ content: `Something went wrong with your input. Please let Enraa know with the exact thing you put in the Type field!`, flags: MessageFlags.Ephemeral });
				return;
			}

			// REFLECT
			if (gaggeduser.id == process.client.user.id) {
				data.gagreflect = true;
				data.textdata.interactionuser = process.client.user;
				data.textdata.targetuser = interaction.user;
				interactionuser = process.client.user;
				gaggeduser = interaction.user;
			}

			if (getHeavy(interactionuser.id)) {
				// in heavy bondage, cant equip
				data.heavy = true;
				if (interactionuser == gaggeduser) {
					// gagging self
					data.self = true;
					if (getGag(interactionuser.id)) {
						// has a gag already
						data.gag = true;
						interaction.reply(getText(data));
					} else {
						// No gag already
						data.nogag = true;
						interaction.reply(getText(data));
					}
				} else {
					// gagging another
					data.other = true;
					if (getGag(gaggeduser.id)) {
						// has a gag already
						data.gag = true;
						interaction.reply(getText(data));
					} else {
						// No gag already
						data.nogag = true;
						interaction.reply(getText(data));
					}
				}
			} else if (getMitten(interactionuser.id)) {
				// We are wearing mittens, we can't hold onto the straps!
				data.noheavy = true;
				data.mitten = true;
				if (interactionuser.id != gaggeduser.id) {
					data.other = true; // yes, this is backwards, sorry.
					if (getGag(gaggeduser.id)) {
						data.gag = true;
						interaction.reply(getText(data));
					} else {
						data.nogag = true;
						interaction.reply(getText(data));
					}
				} else {
					data.self = true;
					interaction.reply(getText(data));
				}
			} else {
				// We have fingers!
				data.noheavy = true;
				data.nomitten = true;
				if (interactionuser.id == gaggeduser.id) {
					// Gagging ourself
					data.self = true;
					if (getGag(gaggeduser.id)) {
						// We are already gagged!
						data.gag = true;
						if (currentgag) {
							// We are already gagged with that kind. Remove and put it at the end of the list!
							data.changetightness = true;
							interaction.reply(getText(data));
							assignGag(gaggeduser.id, gagtype, gagintensity, interactionuser.id);
						} else {
							// We are NOT gagged with this kind.
							data.newgag = true;
							await interaction.deferReply({ flags: MessageFlags.Ephemeral });
							await handleExtremeRestraint(interactionuser, gaggeduser, "gag", gagtype).then(
								async (success) => {
									await interaction.followUp({ content: `Equipping ${gagname}`, withResponse: true });
									await interaction.followUp(getText(data));
									assignGag(gaggeduser.id, gagtype, gagintensity, interactionuser.id);
								},
								async (reject) => {
									let nomessage = `You rejected the ${gagname}.`;
									if (reject == "Disabled") {
										nomessage = `${gagname} is currently disabled in your Extreme options - **/config**`;
									}
									if (reject == "Error") {
										nomessage = `Something went wrong - Submit a bug report!`;
									}
									if (reject == "NoDM") {
										nomessage = `Something went wrong sending a DM to you, or you have DMs from this server disabled. Cannot obtain consent for this restraint.`;
									}
									await interaction.followUp(nomessage);
								},
							);
						}
					} else {
						// Not already gagged, lets put one on
						data.nogag = true;
						await interaction.deferReply({ flags: MessageFlags.Ephemeral });
						await handleExtremeRestraint(interactionuser, gaggeduser, "gag", gagtype).then(
							async (success) => {
								await interaction.followUp({ content: `Equipping ${gagname}`, withResponse: true });
								await interaction.followUp(getText(data));
								assignGag(gaggeduser.id, gagtype, gagintensity, interactionuser.id);
							},
							async (reject) => {
								let nomessage = `You rejected the ${gagname}.`;
								if (reject == "Disabled") {
									nomessage = `${gagname} is currently disabled in your Extreme options - **/config**`;
								}
								if (reject == "Error") {
									nomessage = `Something went wrong - Submit a bug report!`;
								}
								if (reject == "NoDM") {
									nomessage = `Something went wrong sending a DM to you, or you have DMs from this server disabled. Cannot obtain consent for this restraint.`;
								}
								await interaction.followUp(nomessage);
							},
						);
					}
				} else {
					// Gagging others
					data.other = true;
					if (getGag(gaggeduser.id)) {
						// They are already gagged, so we want to change gags
						// Note, we should check if we're allowed in this case, since it may interfere.
						data.gag = true;
						if (currentgag) {
							// We are already gagged with that kind. Remove and put it at the end of the list!
							data.changetightness = true;
							// Now lets make sure the wearer wants that.
							if (checkBondageRemoval(interactionuser.id, gaggeduser.id, "gag") == true) {
								// Allowed immediately, lets go
								interaction.reply(getText(data));
								assignGag(gaggeduser.id, gagtype, gagintensity, interactionuser.id);
							} else {
								// We need to ask first.
								let datatogeneric = Object.assign({}, data.textdata);
								datatogeneric.c1 = "gag";
								interaction.reply({ content: getTextGeneric("changebind", datatogeneric), flags: MessageFlags.Ephemeral });
								let canRemove = await handleBondageRemoval(interactionuser, gaggeduser, "gag", true).then(
									async (res) => {
										await interaction.editReply(getTextGeneric("changebind_accept", datatogeneric));
										await interaction.followUp(getText(data));
										assignGag(gaggeduser.id, gagtype, gagintensity, interactionuser.id);
									},
									async (rej) => {
										await interaction.editReply(getTextGeneric("changebind_decline", datatogeneric));
									},
								);
							}
						} else {
							// We are NOT gagged with this kind.
							data.newgag = true;
							// Now lets make sure the wearer wants that.
							if (checkBondageRemoval(interactionuser.id, gaggeduser.id, "gag") == true) {
								// Allowed immediately, lets go
								await interaction.deferReply({ flags: MessageFlags.Ephemeral });
								await handleExtremeRestraint(interactionuser, gaggeduser, "gag", gagtype).then(
									async (success) => {
										await interaction.followUp({ content: `Equipping ${gagname}`, withResponse: true });
										await interaction.followUp(getText(data));
										assignGag(gaggeduser.id, gagtype, gagintensity, interactionuser.id);
									},
									async (reject) => {
										let nomessage = `${gaggeduser} rejected the ${gagname}.`;
										if (reject == "Disabled") {
											nomessage = `${gagname} is currently disabled in ${gaggeduser}'s Extreme options.`;
										}
										if (reject == "Error") {
											nomessage = `Something went wrong - Submit a bug report!`;
										}
										if (reject == "NoDM") {
											nomessage = `Something went wrong sending a DM to ${gaggeduser}, or ${gaggeduser} has DMs from this server disabled. Cannot obtain consent for this restraint.`;
										}
										await interaction.followUp(nomessage);
									},
								);
							} else {
								// We need to ask first.
								let datatogeneric = Object.assign({}, data.textdata);
								datatogeneric.c1 = "gag";
								interaction.reply({ content: getTextGeneric("changebind", datatogeneric), flags: MessageFlags.Ephemeral });
								let canRemove = await handleBondageRemoval(interactionuser, gaggeduser, "gag", true).then(
									async (res) => {
										await interaction.editReply(getTextGeneric("changebind_accept", datatogeneric));
										await handleExtremeRestraint(interactionuser, gaggeduser, "gag", gagtype).then(
											async (success) => {
												await interaction.followUp({ content: `Equipping ${gagname}`, withResponse: true });
												await interaction.followUp(getText(data));
												assignGag(gaggeduser.id, gagtype, gagintensity, interactionuser.id);
											},
											async (reject) => {
												let nomessage = `${gaggeduser} rejected the ${gagname}.`;
												if (reject == "Disabled") {
													nomessage = `${gagname} is currently disabled in ${gaggeduser}'s Extreme options.`;
												}
												if (reject == "Error") {
													nomessage = `Something went wrong - Submit a bug report!`;
												}
												if (reject == "NoDM") {
													nomessage = `Something went wrong sending a DM to ${gaggeduser}, or ${gaggeduser} has DMs from this server disabled. Cannot obtain consent for this restraint.`;
												}
												await interaction.followUp(nomessage);
											},
										);
									},
									async (rej) => {
										await interaction.editReply(getTextGeneric("changebind_decline", datatogeneric));
									},
								);
							}
						}
					} else {
						// Not already gagged, lets put one on
						// Respects tone currently!
						data.nogag = true;
						data[tone] = true;
						await interaction.deferReply({ flags: MessageFlags.Ephemeral });
						await handleExtremeRestraint(interactionuser, gaggeduser, "gag", gagtype).then(
							async (success) => {
								await interaction.followUp({ content: `Equipping ${gagname}`, withResponse: true });
								await interaction.followUp(getText(data));
								assignGag(gaggeduser.id, gagtype, gagintensity, interactionuser.id);
							},
							async (reject) => {
								let nomessage = `${gaggeduser} rejected the ${gagname}.`;
								if (reject == "Disabled") {
									nomessage = `${gagname} is currently disabled in ${gaggeduser}'s Extreme options.`;
								}
								if (reject == "Error") {
									nomessage = `Something went wrong - Submit a bug report!`;
								}
								if (reject == "NoDM") {
									nomessage = `Something went wrong sending a DM to ${gaggeduser}, or ${gaggeduser} has DMs from this server disabled. Cannot obtain consent for this restraint.`;
								}
								await interaction.followUp(nomessage);
							},
						);
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
    async help(userid, page) {
        let restrictedtext = (getMitten(userid)) ? `***You cannot gag anyone because of your mittens***\n` : ""
        let overviewtext = `## Gag
### Usage: /gag (user) (intensity) (tone)
### Remove:  /ungag (user) (gag)
-# Restricted if wearing mittens
${restrictedtext}
Applies a gag to the target **user**, impairing their speech in various ways. The standard gag is the **Ball Gag**, but others exist which will garble the wearer's speech in other ways. **Intensity** will sometimes influence how much the gag affects speech. **Tone** will affect the tone of the application text to others.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
