const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { getMitten } = require("./../functions/gagfunctions.js");
const { getHeavy } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent } = require("./../functions/interactivefunctions.js");
const { getWearable, assignWearable, getWearableName, getBaseWearable } = require("../functions/wearablefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { default: didYouMean, ReturnTypeEnums, ThresholdTypeEnums } = require("didyoumean2");
const { getUserTags } = require("../functions/configfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("wear")
		.setDescription(`Apply fashion to someone. . .`)
		.addUserOption((opt) => opt.setName("user").setDescription("Who to apply fashion to?"))
		.addStringOption((opt) => opt.setName("type").setDescription("What fashion to wear...").setAutocomplete(true)),
	async autoComplete(interaction) {
        try {
            let chosenuserid = interaction.options.get("user")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
            let itemsworn = getWearable(chosenuserid);

            // Remove anything we're already wearing from the list
            const focusedValue = interaction.options.getFocused();
            let autocompletes = process.autocompletes.wearables.filter((f) => !itemsworn.includes(f.value));
            let matches = didYouMean(focusedValue, autocompletes, {
                matchPath: ['name'], 
                returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
            })
            if (matches.length == 0) {
                matches = autocompletes.slice(0,25);
            }
            let tags = getUserTags(chosenuserid);
            let newsorted = [];
            matches.forEach((f) => {
                let tagged = false;
                let i = process.wearabletypes.find((w) => w.value == f.value)
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
			let wearableuser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
			let wearablechoice = interaction.options.getString("type") ? interaction.options.getString("type") : "catsuit_latex";
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(wearableuser.id)?.mainconsent) {
				await handleConsent(interaction, wearableuser.id);
				return;
			}
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let data = {
				textarray: "texts_wear",
				textdata: {
					interactionuser: interaction.user,
					targetuser: wearableuser,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: getWearableName(wearableuser.id, wearablechoice),
				},
			};

			if (data.textdata.c2 == undefined) {
				// Something went CRITICALLY wrong. Eject, eject!
				interaction.reply({ content: `Something went wrong with your input. Please let Enraa know with the exact thing you put in the Type field!`, flags: MessageFlags.Ephemeral });
				return;
			}

            let blocked = false;
            if (wearablechoice) {
                let tags = getUserTags(wearableuser.id);
                let i = getBaseWearable(wearablechoice)
                tags.forEach((t) => {
                    if (i && i.tags && i.tags[t] && (wearableuser != interaction.user)) {
                        interaction.reply({ content: `${wearableuser}'s content settings forbid this item - ${i.name}!`, flags: MessageFlags.Ephemeral })
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
				if (wearableuser.id == interaction.user.id) {
					// ourselves
					data.self = true;
					if (getWearable(wearableuser.id).includes(wearablechoice)) {
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
					if (getWearable(wearableuser.id).includes(wearablechoice)) {
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
				if (wearableuser.id == interaction.user.id) {
					// ourselves
					data.self = true;
					if (getWearable(wearableuser.id).includes(wearablechoice)) {
						// Wearing the headgear already, Ephemeral
						data.worn = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					} else {
						// Not wearing it!
						data.noworn = true;
						assignWearable(wearableuser.id, wearablechoice);
						interaction.reply(getText(data));
					}
				} else {
					// Them
					data.other = true;
					if (getWearable(wearableuser.id).includes(wearablechoice)) {
						// Wearing the headgear already, Ephemeral
						data.worn = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					} else {
						// Not wearing it!
						data.noworn = true;
						assignWearable(wearableuser.id, wearablechoice);
						interaction.reply(getText(data));
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
    async help(userid, page) {
        let overviewtext = `## Wear
### Usage: /wear (user) (type)
### Remove:  /unwear (user) (type)
-# Restricted if in heavy bondage

Applies clothing, makeup or other ornamentation to the user. These items can be protected by the wearer using **/item**. Outfits can be saved using the **/outfit** menu.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
