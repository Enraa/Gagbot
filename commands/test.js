const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { calculateTimeout } = require("./../functions/timefunctions.js");
const { getHeavy, assignHeavy, commandsheavy, convertheavy, heavytypes, getBaseHeavy } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent, handleExtremeRestraint, handleMajorRestraint } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getUserTags } = require("../functions/configfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
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
            let heavychoice = interaction.options.getString("type") ? interaction.options.getString("type") : "armbinder_latex";
            await handleMajorRestraint(interaction.user, interaction.user, "heavy", heavychoice).then((p) => {
                console.log("SUCCESS")
            },
            (p) => {
                console.log("REJECTED")
            })
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
