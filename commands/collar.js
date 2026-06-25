const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { collartypes } = require("./../functions/collarfunctions.js");
const { handleConsent, collarPermModal } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getBaseCollar } = require("../functions/getters/collar/getBaseCollar.js");
const { getUserTags } = require("../functions/getters/config/getUserTags.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { getHeavy } = require("../functions/getters/heavy/getHeavy.js");
const { getCollarName } = require("../functions/getters/collar/getCollarName.js");
const { getCollar } = require("../functions/getters/collar/getCollar.js");
const { getHeavyBound } = require("../functions/getters/heavy/getHeavyBound.js");
const { assignCollar } = require("../functions/setters/collar/assignCollar.js");
const { canAccessCollar } = require("../functions/getters/collar/canAccessCollar.js");
const { getOption } = require("../functions/getters/config/getOption.js");
const { getTaggedList } = require("../functions/getters/config/getTaggedList.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("collar")
		.setDescription(`Put a collar on, allowing others to /chastity, /heavy and /mitten you`)
		.addStringOption((opt) => opt.setName("type").setDescription("What kind of collar to wear...").setAutocomplete(true)),
	async autoComplete(interaction) {
		try {
            const focusedValue = interaction.options.getFocused();
            let autocompletes = process.autocompletes.collar;
            let matches = didYouMean(focusedValue, autocompletes, {
                matchPath: ['name'], 
                returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
            })
            
            if (matches.length == 0) {
                matches = autocompletes;
            }
            let hideitem = true;
            if (getOption(interaction.guildId, interaction.user.id, "forbiddenitemdisplay") == "showeveryone") {
                hideitem = false;
            }
            if ((getOption(interaction.guildId, interaction.user.id, "forbiddenitemdisplay") == "showself") && (interaction.user.id == interaction.user.id)) {
                hideitem = false;
            }
            let newsorted = getTaggedList(interaction.guildId, interaction.user.id, matches, hideitem);
            newsorted = newsorted.filter((c) => !getBaseCollar(c.value).specialonly)
            interaction.respond(newsorted.slice(0,25))
        }
        catch (err) {
            console.log(err);
        }
	},
	async execute(interaction) {
		try {
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.guildId, interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let collarselected = interaction.options.getString("type");

			// Build data tree:
			let data = {
				textarray: "texts_collar",
				textdata: {
                    serverID: interaction.guildId,
					interactionuser: interaction.user,
					targetuser: interaction.options.getUser("keyholder") ? interaction.options.getUser("keyholder") : interaction.user,
					c1: getHeavy(interaction.guildId, interaction.user.id)?.displayname, // heavy bondage type
                    c2: getCollarName(interaction.guildId, interaction.user.id, getCollar(interaction.guildId, interaction.user.id)?.collartype) ?? "collar"
				},
			};

			if (!getHeavyBound(interaction.guildId, interaction.user.id, interaction.user.id)) {
				data.heavy = true;
				if (getCollar(interaction.guildId, interaction.user.id)) {
					data.collar = true;
					await interaction.reply(getText(data));
					return;
				} else {
					data.nocollar = true;
					await interaction.reply(getText(data));
					return;
				}
			}
			if (getCollar(interaction.guildId, interaction.user.id)) {
				data.noheavy = true;
				data.alreadycollared = true;
				await interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
				return;
			}

            if (process.recentinteractions == undefined) { process.recentinteractions = {} }
            process.recentinteractions[interaction.user.id] = interaction;

            await interaction.showModal(collarPermModal(interaction, interaction.user, false, collarselected));
		} catch (err) {
			console.log(err);
		}
	},
	async modalexecute(interaction) {
		try {
			let collarkeyholder = interaction.fields.getField("keyholderselection").members.first().user.id
			let collarkeyholderonly = !(interaction.fields.fields.has("freeuseselection") && interaction.fields.getStringSelectValues("freeuseselection") && interaction.fields.getStringSelectValues("freeuseselection").includes("freeuse_yes"))
            let checkboxselectedValues = interaction.fields.getCheckboxGroup('permissionscheckboxgroup')
			let choice_mitten = checkboxselectedValues.includes("mitten")
			let choice_chastity = checkboxselectedValues.includes("chastity")
			let choice_heavy = checkboxselectedValues.includes("heavy")
			let choice_mask = checkboxselectedValues.includes("mask")
			// lol consistency with naming scheme is hard
			let choice_collartype = interaction.customId.split("_")[3].length > 0 ? `${interaction.customId.split("_")[3]}_${interaction.customId.split("_")[4]}` : undefined;
            if (choice_collartype.endsWith("_undefined")) { // This is an ugly workaround
                choice_collartype = choice_collartype.replace("_undefined", "");
            }

			// Build data tree:
			let data = {
				textarray: "texts_collar",
				textdata: {
                    serverID: interaction.guildId, 
					interactionuser: interaction.user,
					targetuser: await interaction.client.users.fetch(collarkeyholder), // To fetch the target user object
					c1: getHeavy(interaction.guildId, interaction.user.id)?.displayname, // heavy bondage type
					c2: getCollarName(interaction.guildId, interaction.user.id, choice_collartype) ?? "collar",
				},
			};

			if (!getHeavyBound(interaction.guildId, interaction.user.id, interaction.user.id)) {
				data.heavy = true;
				if (getCollar(interaction.guildId, interaction.user.id)) {
					data.collar = true;
					interaction.reply(getText(data));
				} else {
					data.nocollar = true;
					interaction.reply(getText(data));
				}
			} else if (getCollar(interaction.guildId, interaction.user.id)) {
				// This should never happen, because we find out they have a collar on before the modal.
				data.noheavy = true;
				data.alreadycollared = true;
				interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
			} else {
				data.noheavy = true;
				if (collarkeyholder == interaction.user.id) {
					data.self = true;
					if (collarkeyholderonly) {
						data.nofreeuse = true;
						if (choice_collartype) {
							// Custom named collar declared
							data.namedcollar = true;
							/* Okay WHY Discord. Cannot have chaining followup modals. Limited user experience. :< 
                            if (process.modalfunctions?.collar && process.modalfunctions.collar[choice_collartype]) {
                                await interaction.reply(getText(data));
                                await process.recentinteractions[interaction.user.id].showModal(await process.modalfunctions.collar[choice_collartype](interaction, interaction.user.id))
                            }
                            else {*/
                                interaction.reply(getText(data));
                            //}
							assignCollar(interaction.guildId, interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, true, choice_collartype);
						} else {
							data.nonamedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.guildId, interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, true);
						}
					} else {
						data.freeuse = true;
						if (choice_collartype) {
							// Custom named collar declared
							data.namedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.guildId, interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, false, choice_collartype);
						} else {
							data.nonamedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.guildId, interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, false);
						}
					}
				} else if (collarkeyholder != interaction.user.id) {
					data.other = true;
					if (collarkeyholderonly) {
						data.nofreeuse = true;
						if (choice_collartype) {
							// Custom named collar declared
							data.namedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.guildId, interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, true, choice_collartype);
						} else {
							data.nonamedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.guildId, interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, true);
						}
					} else {
						data.freeuse = true;
						if (choice_collartype) {
							// Custom named collar declared
							data.namedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.guildId, interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, false, choice_collartype);
						} else {
							data.nonamedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.guildId, interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, false);
						}
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
    async help(userid, page) {
        let restrictedtext = (getCollar(interaction.guildId, userid) && !canAccessCollar(interaction.guildId, userid, userid, true).access) ? `***You cannot unlock your collar currently***\n` : ""
        let overviewtext = `## Collar
### Usage: /collar (keyholder) (freeuse) (type)
### Remove:  /uncollar (user)
-# Restricted if not holding the device's key or in heavy bondage
${restrictedtext}
Opens a window to configure settings for a collar for options your **keyholder** can do to you using the **/collarequip** command. These settings include permissions to **Mitten, Chastity, Heavy Bondage** and to **Mask**. **Freeuse** (if configured in **/config**) will allow everyone to do these permissions to you. Once selected, you will put on the collar. Please note, **/uncollar** requires arms and cannot be done if in **Heavy Bondage**.`
        let overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
