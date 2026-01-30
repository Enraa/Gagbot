const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { getHeavy } = require("./../functions/heavyfunctions.js");
const { getCollar, assignCollar, collartypes, getCollarName, getBaseCollar, canAccessCollar } = require("./../functions/collarfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent, collarPermModal } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { getOption } = require("../functions/configfunctions.js");
const { getUserTags } = require("../functions/configfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("collar")
		.setDescription(`Put a collar on, allowing others to /chastity, /heavy and /mitten you`)
		.addUserOption((opt) => opt.setName("keyholder").setDescription("Who can do anything to you?"))
		.addBooleanOption((opt) => opt.setName("freeuse").setDescription("Allow public access (Free Use?"))
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
            let tags = getUserTags(interaction.user.id);
            let newsorted = [];
            matches.forEach((f) => {
                let tagged = false;
                let i = getBaseCollar(f.value)
                tags.forEach((t) => {
                    if (i.tags && i.tags.includes(t)) { tagged = true }
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
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let collarkeyholder = interaction.options.getUser("keyholder") ?? interaction.user;
			let collarselected = interaction.options.getString("type");
			let freeuse = interaction.options.getBoolean("freeuse");

			// Check if they have free use enabled and it's allowed
			// If not, tell them to strongly consider what they're doing and review /config
			if (freeuse && getOption(interaction.user.id, "publicaccess") != "enabled") {
				await interaction.reply({
					content: `You have not enabled Free Use. **Please strongly consider what you are doing.**\n\nFree use access will allow ***anyone*** to utilize mittens, chastity, hoods and heavy bondage on you. **You will be unable to say no to specific restraints or specific people by design.**\n\nYou should assume that you *will* become helpless and stuck with this option, including becoming unable to take off the collar. Only enable it if you understand what you're doing. If you do, this can be adjusted in **/config**.`,
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			// Build data tree:
			let data = {
				textarray: "texts_collar",
				textdata: {
					interactionuser: interaction.user,
					targetuser: interaction.options.getUser("keyholder") ? interaction.options.getUser("keyholder") : interaction.user,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
				},
			};

			if (getHeavy(interaction.user.id)) {
				data.heavy = true;
				if (getCollar(interaction.user.id)) {
					data.collar = true;
					await interaction.reply(getText(data));
					return;
				} else {
					data.nocollar = true;
					await interaction.reply(getText(data));
					return;
				}
			}
			if (getCollar(interaction.user.id)) {
				data.noheavy = true;
				data.alreadycollared = true;
				await interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
				return;
			}

			if (collarkeyholder && collarkeyholder.id != undefined) {
				//interaction.deferReply();
				await interaction.showModal(collarPermModal(interaction, collarkeyholder, freeuse, collarselected));
			} else {
				//interaction.deferReply();
				await interaction.showModal(collarPermModal(interaction, interaction.user, freeuse, collarselected));
			}
		} catch (err) {
			console.log(err);
		}
	},
	async modalexecute(interaction) {
		try {
			let collarkeyholder = interaction.customId.split("_")[1]; // Note this is THE ID, we need to adjust our code
			let collarkeyholderonly = interaction.customId.split("_")[2]; // t or f
			let choice_mitten = interaction.fields.getStringSelectValues("mitten") == "mitten_yes" ? true : false;
			let choice_chastity = interaction.fields.getStringSelectValues("chastity") == "chastity_yes" ? true : false;
			let choice_heavy = interaction.fields.getStringSelectValues("heavy") == "heavy_yes" ? true : false;
			let choice_mask = interaction.fields.getStringSelectValues("mask") == "mask_yes" ? true : false;
			// lol consistency with naming scheme is hard
			let choice_collartype = interaction.customId.split("_")[3].length > 0 ? `${interaction.customId.split("_")[3]}_${interaction.customId.split("_")[4]}` : undefined;

			// Build data tree:
			let data = {
				textarray: "texts_collar",
				textdata: {
					interactionuser: interaction.user,
					targetuser: await interaction.client.users.fetch(collarkeyholder), // To fetch the target user object
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: getCollarName(interaction.user.id, choice_collartype) ?? "collar",
				},
			};

			if (getHeavy(interaction.user.id)) {
				data.heavy = true;
				if (getCollar(interaction.user.id)) {
					data.collar = true;
					interaction.reply(getText(data));
				} else {
					data.nocollar = true;
					interaction.reply(getText(data));
				}
			} else if (getCollar(interaction.user.id)) {
				// This should never happen, because we find out they have a collar on before the modal.
				data.noheavy = true;
				data.alreadycollared = true;
				interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
			} else {
				data.noheavy = true;
				if (collarkeyholder == interaction.user.id) {
					data.self = true;
					if (collarkeyholderonly == "t") {
						data.nofreeuse = true;
						if (choice_collartype) {
							// Custom named collar declared
							data.namedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, true, choice_collartype);
						} else {
							data.nonamedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, true);
						}
					} else {
						data.freeuse = true;
						if (choice_collartype) {
							// Custom named collar declared
							data.namedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, false, choice_collartype);
						} else {
							data.nonamedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, false);
						}
					}
				} else if (collarkeyholder != interaction.user.id) {
					data.other = true;
					if (collarkeyholderonly == "t") {
						data.nofreeuse = true;
						if (choice_collartype) {
							// Custom named collar declared
							data.namedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, true, choice_collartype);
						} else {
							data.nonamedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, true);
						}
					} else {
						data.freeuse = true;
						if (choice_collartype) {
							// Custom named collar declared
							data.namedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, false, choice_collartype);
						} else {
							data.nonamedcollar = true;
							interaction.reply(getText(data));
							assignCollar(interaction.user.id, collarkeyholder, { mitten: choice_mitten, chastity: choice_chastity, heavy: choice_heavy, mask: choice_mask }, false);
						}
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
    async help(userid, page) {
        let restrictedtext = (getCollar(userid) && !canAccessCollar(userid, userid, true).access) ? `***You cannot unlock your collar currently***\n` : ""
        let overviewtext = `## Collar
### Usage: /collar (keyholder) (freeuse) (type)
### Remove:  /uncollar (user)
-# Restricted if not holding the device's key or in heavy bondage
${restrictedtext}
Opens a window to configure settings for a collar for options your **keyholder** can do to you using the **/collarequip** command. These settings include permissions to **Mitten, Chastity, Heavy Bondage** and to **Mask**. **Freeuse** (if configured in **/config**) will allow everyone to do these permissions to you. Once selected, you will put on the collar. Please note, **/uncollar** requires arms and cannot be done if in **Heavy Bondage**.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
