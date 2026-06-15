const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { handleConsent } = require("./../functions/interactivefunctions.js");
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");
const { checkBondageRemoval, handleBondageRemoval } = require("../functions/interactivefunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getGags } = require("../functions/getters/gag/getGags.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { getHeavyBound } = require("../functions/getters/heavy/getHeavyBound.js");
const { getGag } = require("../functions/getters/gag/getGag.js");
const { getHeavy } = require("../functions/getters/heavy/getHeavy.js");
const { getMitten } = require("../functions/getters/mitten/getMitten.js");
const { deleteGag } = require("../functions/setters/gag/removeGag.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ungag")
		.setDescription("Remove a gag from a user")
        .addUserOption((opt) => opt.setName("user").setDescription("The user to remove gag from (leave blank for yourself)"))
		.addStringOption((opt) => opt.setName("gag").setDescription("Which gag to remove?").setAutocomplete(true)),
	async autoComplete(interaction) {
		try {
            const focusedValue = interaction.options.getFocused();
            let chosenuserid = interaction.options.get("user")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
            let worngags = getGags(chosenuserid).map((g) => {
                if (process.autocompletes.gag.find((t) => t.value == g.gagtype)) {
                    return { name: process.autocompletes.gag.find((t) => t.value == g.gagtype).name, value: g.gagtype };
                }
            });
            for(let i = 0; i < worngags.length; i++) {
                if ((!worngags[i].name) || (!worngags[i].value)) {
                    worngags.splice(i,1);
                    i--;
                }
            }

            let matches = didYouMean(focusedValue, worngags, {
                matchPath: ['name'], 
                returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
            })
            if (matches.length == 0) {
                matches = worngags;
            }
            // They aren't wearing any lol
            if (matches.length == 0) {
                matches = [{ name: "Not Wearing Any Gags", value: "ball" }]
            }

            await interaction.respond(matches.slice(0,25));
        }
        catch (err) {
            console.log(err);
        }
	},
	async execute(interaction) {
		try {
			let gaggeduser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
			let gagtoremove = interaction.options.getString("gag");
			if (getGags(gaggeduser.id).length == 1) {
				gagtoremove = getGags(gaggeduser.id)[0].gagtype;
			}
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let data = {
				textarray: "texts_ungag",
				textdata: {
					interactionuser: interaction.user,
					targetuser: gaggeduser,
					c1: getHeavy(interaction.user.id)?.displayname, // heavy bondage type
					c2: process.gagtypes.find((t) => t.value == gagtoremove)?.name ?? "gag",
				},
			};

			// Fuck it, I'm just gonna redo the code path because I've been redoing all the removals anyway.
			if (!getHeavyBound(interaction.user.id, gaggeduser.id)) {
				// We are in heavy bondage
				data.heavy = true;
				if (gaggeduser == interaction.user) {
					// Trying to ungag ourselves.
					data.self = true;
					if (getGag(gaggeduser.id)) {
						// We are wearing a gag
						data.gag = true;
						interaction.reply(getText(data));
					} else {
						// Not gagged! Ephemeral
						data.nogag = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				} else {
					// We are trying to ungag someone else
					data.other = true;
					if (getGag(gaggeduser.id)) {
						// They are wearing a gag
						data.gag = true;
						interaction.reply(getText(data));
					} else {
						// Not gagged! Ephemeral
						data.nogag = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				}
			} else {
				// Not in heavy bondage
				data.noheavy = true;
				if (getMitten(interaction.user.id)) {
					// We are wearing mittens!
					data.mitten = true;
					if (gaggeduser == interaction.user) {
						// Trying to ungag ourselves.
						data.self = true;
						if (getGag(gaggeduser.id)) {
							// We are wearing a gag
							data.gag = true;
							interaction.reply(getText(data));
						} else {
							// Not gagged! Ephemeral
							data.nogag = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					} else {
						// We are trying to ungag someone else
						data.other = true;
						if (getGag(gaggeduser.id)) {
							// They are wearing a gag
							data.gag = true;
							interaction.reply(getText(data));
						} else {
							// Not gagged! Ephemeral
							data.nogag = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					}
				} else {
					// We are NOT wearing mittens!
					data.nomitten = true;
					if (gaggeduser == interaction.user) {
						// Trying to ungag ourselves.
						data.self = true;
						if (getGag(gaggeduser.id)) {
							// We are wearing a gag
							data.gag = true;
                            // Now check if we have any gags that are locked on!
                            let lockedheadgears = [];
                            if (process.headwear[gaggeduser.id]) { lockedheadgears = Object.keys(process.headwear[gaggeduser.id]) }
                            if (gagtoremove && process.headwear[gaggeduser.id] && process.headwear[gaggeduser.id][`gagharness_${gagtoremove}`]) {
                                data.failed = true
                                interaction.reply(getText(data));
                            }
							else if (gagtoremove) {
								data.single = true;
								interaction.reply(getText(data));
								deleteGag(gaggeduser.id, gagtoremove);
							} else if (lockedheadgears.find((h) => h.startsWith(`gagharness`))) {
								data.multipleharnessed = true;
								interaction.reply(getText(data));
								deleteGag(gaggeduser.id);
							} else {
                                data.multiple = true;
								interaction.reply(getText(data));
								deleteGag(gaggeduser.id);
                            }
						} else {
							// Not gagged! Ephemeral
							data.nogag = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					} else {
						// We are trying to ungag someone else
						data.other = true;
						if (getGag(gaggeduser.id)) {
							// They are wearing a gag
							data.gag = true;
                            // Now check if we have any gags that are locked on!
                            let lockedheadgears = [];
                            if (process.headwear[gaggeduser.id]) { lockedheadgears = Object.keys(process.headwear[gaggeduser.id]) }
                            if (gagtoremove && process.headwear[gaggeduser.id] && process.headwear[gaggeduser.id][`gagharness_${gagtoremove}`]) {
                                data.failed = true
                                interaction.reply(getText(data));
                                return;
                            }
							// Now lets make sure the wearer wants that.
							if (checkBondageRemoval(interaction.user.id, gaggeduser.id, "gag") == true) {
								// Allowed immediately, lets go
								if (gagtoremove) {
									data.single = true;
									interaction.reply(getText(data));
									deleteGag(gaggeduser.id, gagtoremove);
								} else {
                                    if (lockedheadgears.find((h) => h.startsWith(`gagharness`))) {
                                        data.multipleharnessed = true;
                                    }
                                    else {
                                        data.multiple = true;
                                    }
									interaction.reply(getText(data));
									deleteGag(gaggeduser.id);
								}
							} else {
								// We need to ask first.
								let datatogeneric = Object.assign({}, data.textdata);
								datatogeneric.c1 = "gag";
								interaction.reply({ content: getTextGeneric("unbind", datatogeneric), flags: MessageFlags.Ephemeral });
								let canRemove = await handleBondageRemoval(interaction.user, gaggeduser, "gag").then(
									async (res) => {
										await interaction.editReply(getTextGeneric("unbind_accept", datatogeneric));
										if (gagtoremove) {
											data.single = true;
											await interaction.followUp(getText(data));
											deleteGag(gaggeduser.id, gagtoremove);
										} else {
											if (lockedheadgears.find((h) => h.startsWith(`gagharness`))) {
                                                data.multipleharnessed = true;
                                            }
                                            else {
                                                data.multiple = true;
                                            }
											await interaction.followUp(getText(data));
											deleteGag(gaggeduser.id);
										}
									},
									async (rej) => {
										await interaction.editReply(getTextGeneric("unbind_decline", datatogeneric));
									},
								);
							}
						} else {
							// Not gagged! Ephemeral
							data.nogag = true;
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
