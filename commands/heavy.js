const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { calculateTimeout } = require("./../functions/timefunctions.js");
const { getHeavy, assignHeavy, commandsheavy, convertheavy, heavytypes, getBaseHeavy } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent, handleExtremeRestraint } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getUserTags } = require("../functions/configfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("heavy")
		.setDescription(`Put heavy bondage on, preventing the use of any command`)
		.addStringOption((opt) =>
			opt
				.setName("type")
				.setDescription("What flavor of helpless restraint to wear...")
				.setAutocomplete(true),
		),
	async autoComplete(interaction) {
        try {
            const focusedValue = interaction.options.getFocused();
            let autocompletes = process.heavytypes.filter((f) => !getBaseHeavy(f.value).noself);
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
                let i = getBaseHeavy(f.value)
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
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			// List all heavy restraints if set.
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
			let heavychoice = interaction.options.getString("type") ? interaction.options.getString("type") : "armbinder_latex";
			// Build data tree:
			let data = {
				textarray: "texts_heavy",
				textdata: {
					interactionuser: interaction.user,
					targetuser: interaction.user,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: convertheavy(heavychoice), // New heavy bondage
				},
			};

			// This SHOULD retrieve a custom name if any.
			if (getBaseHeavy(heavychoice) && getBaseHeavy(heavychoice).namefunction) {
				data = getBaseHeavy(heavychoice).namefunction(interaction, data);
			}

			if (data.textdata.c2 == undefined) {
				// Something went CRITICALLY wrong. Eject, eject!
				interaction.reply({ content: `Something went wrong with your input. Please let Enraa know with the exact thing you put in the Type field!`, flags: MessageFlags.Ephemeral });
				return;
			}

			if (getHeavy(interaction.user.id)) {
				data.heavy = true;
				interaction.reply(getText(data));
			} else {
				data.noheavy = true;
				await interaction.deferReply({ flags: MessageFlags.Ephemeral });
				await handleExtremeRestraint(interaction.user, interaction.user, "heavy", heavychoice).then(
					async (success) => {
						await interaction.followUp({ content: `Equipping ${convertheavy(heavychoice)}`, withResponse: true });
						await interaction.followUp(getText(data));
						assignHeavy(interaction.user.id, heavychoice, interaction.user.id);
					},
					async (reject) => {
						let nomessage = `You rejected the ${convertheavy(heavychoice)}.`;
						if (reject == "Disabled") {
							nomessage = `${convertheavy(heavychoice)} is currently disabled in your Extreme options - **/config**`;
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
		} catch (err) {
			console.log(err);
		}
	},
    async help(userid, page) {
        let restrictedtext = (getHeavy(userid)) ? `***You are in heavy bondage***\n` : ""
        let overviewtext = `## Heavy
### Usage: /heavy (type)
### Remove:  /unheavy (user)
-# Restricted if in heavy bondage
${restrictedtext}
Applies some form of **Heavy Bondage** to yourself. While in heavy bondage, you will be unable to use nearly all commands and will require someone else to **/unheavy** you to gain access to them again.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
