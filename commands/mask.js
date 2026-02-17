const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { getMitten } = require("./../functions/gagfunctions.js");
const { getHeavy } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent } = require("./../functions/interactivefunctions.js");
const { getHeadwear, assignHeadwear, getHeadwearName, getBaseHeadwear } = require("../functions/headwearfunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { getCollar, getCollarPerm, canAccessCollar } = require("../functions/collarfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getUserTags } = require("../functions/configfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mask")
		.setDescription(`Apply headwear to someone. . .`)
		.addUserOption((opt) => opt.setName("user").setDescription("Who to apply headwear to?"))
		.addStringOption((opt) => opt.setName("type").setDescription("What headwear to wear...").setAutocomplete(true)),
	async autoComplete(interaction) {
        try {
            const focusedValue = interaction.options.getFocused();
            let chosenuserid = interaction.options.get("user")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
            let itemsworn = getHeadwear(chosenuserid);
            let autocompletes = process.headtypes.filter((f) => !itemsworn.includes(f.value));
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
                let i = getBaseHeadwear(f.value)
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
			let headwearuser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
			let headwearchoice = interaction.options.getString("type") ? interaction.options.getString("type") : "hood_latex";
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(headwearuser.id)?.mainconsent) {
				await handleConsent(interaction, headwearuser.id);
				return;
			}
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let data = {
				textarray: "texts_headwear",
				textdata: {
					interactionuser: interaction.user,
					targetuser: headwearuser,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: getHeadwearName(headwearuser.id, headwearchoice),
				},
			};

			if (data.textdata.c2 == undefined) {
				// Something went CRITICALLY wrong. Eject, eject!
				interaction.reply({ content: `Something went wrong with your input. Please let Enraa know with the exact thing you put in the Type field!`, flags: MessageFlags.Ephemeral });
				return;
			}

            let blocked = false;
            if (headwearchoice) {
                let tags = getUserTags(headwearuser.id);
                let i = getBaseHeadwear(headwearchoice)
                tags.forEach((t) => {
                    if (i && i.tags && i.tags[t] && (headwearuser != interaction.user)) {
                        interaction.reply({ content: `${headwearuser}'s content settings forbid this item - ${i.name}!`, flags: MessageFlags.Ephemeral })
                        blocked = true;
                        return;
                    }
                })
            }
            if (blocked) {
                return;
            }

			if (getHeavy(interaction.user.id)) {
				// target is in heavy bondage
				data.heavy = true;
				if (headwearuser.id == interaction.user.id) {
					// ourselves
					data.self = true;
					if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
						// Wearing the headgear already, Ephemeral
						data.worn = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					} else {
						// Not wearing it!
						data.noworn = true;
						interaction.reply(getText(data));
					}
				} else {
					// Them
					data.other = true;
					if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
						// Wearing the headgear already, Ephemeral
						data.worn = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					} else {
						// Not wearing it!
						data.noworn = true;
						interaction.reply(getText(data));
					}
				}
			} else {
				// Not in heavy bondage
				data.noheavy = true;
				if (getMitten(interaction.user.id)) {
					// Wearing mittens!
					data.mitten = true;
					if (headwearuser.id == interaction.user.id) {
						// ourselves
						data.self = true;
						if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
							// Wearing the headgear already, Ephemeral
							data.worn = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						} else {
							// Not wearing it!
							data.noworn = true;
							interaction.reply(getText(data));
						}
					} else {
						// Them
						data.other = true;
						if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
							// Wearing the headgear already, Ephemeral
							data.worn = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						} else {
							// Not wearing it!
							data.noworn = true;
							interaction.reply(getText(data));
						}
					}
				} else {
					// Not wearing mittens!
					data.nomitten = true;
					if (headwearuser.id == interaction.user.id) {
						// ourselves
						data.self = true;
						if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
							// Wearing the headgear already, Ephemeral
							data.worn = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						} else {
							// Not wearing it!
							data.noworn = true;
							if (process.modalfunctions?.headwear && process.modalfunctions.headwear[headwearchoice]) {
                                await interaction.showModal(await process.modalfunctions.headwear[headwearchoice](interaction, headwearuser.id))
                                interaction.followUp(getText(data));
                            }
                            else {
                                interaction.reply(getText(data));
                            }
							assignHeadwear(headwearuser.id, headwearchoice);
						}
					} else {
						// Them
						data.other = true;
						if (getCollar(headwearuser.id)) {
							data.collar = true;
							if (getCollarPerm(headwearuser.id, "mask") && canAccessCollar(headwearuser.id, interaction.user.id).access) {
								data.maskperm = true;
								if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
									// Wearing the headgear already, Ephemeral
									data.worn = true;
									interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
								} else {
									// Not wearing it!
									data.noworn = true;
                                    if (process.modalfunctions?.headwear && process.modalfunctions.headwear[headwearchoice]) {
                                        await interaction.showModal(await process.modalfunctions.headwear[headwearchoice](interaction, headwearuser.id))
                                        interaction.followUp(getText(data));
                                    }
                                    else {
                                        interaction.reply(getText(data));
                                    }
									assignHeadwear(headwearuser.id, headwearchoice);
								}
							} else {
								data.nomaskperm = true;
								interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
							}
						} else {
							data.nocollar = true;
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
						}
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
    async help(userid, page) {
        let restrictedtext = (getMitten(userid)) ? `***You are wearing mittens***\n` : ""
        let overviewtext = `## Mask
### Usage: /mask (user) (type)
### Remove:  /unmask (user) (type)
-# Restricted if in mittens or not holding the user's collar key
${restrictedtext}
Applies some kind of headwear to the user. This headwear can potentially restrict **Emotes** and **Inspect** when worn, as well as other unique effects such as the **Doll Visor**. Requires **Collar** permissions in order to use it on others.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
