const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { mittentypes, getMittenName, getGag, assignMitten, getMitten, getBaseMitten } = require("./../functions/gagfunctions.js");
const { calculateTimeout } = require("./../functions/timefunctions.js");
const { getHeavy } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent, handleMajorRestraint, handleExtremeRestraint } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getUserTags } = require("../functions/configfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mitten")
		.setDescription("Put mittens on yourself, preventing /ungag on yourself and /gag on others")
		.addUserOption((opt) => opt.setName("user").setDescription("Who to apply mittens to?"))
        .addStringOption((opt) => opt.setName("type").setDescription("What flavor of helpless mittens to wear...").setAutocomplete(true)),
	async autoComplete(interaction) {
		try {
            const focusedValue = interaction.options.getFocused();
            let autocompletes = process.autocompletes.mitten;
            let chosenuserid = interaction.options.get("user")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
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
            let chosenmittens = interaction.options.getString("type");
            let targetuser = interaction.options.getUser("user") ?? interaction.user;
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(targetuser.id)?.mainconsent) {
				await handleConsent(interaction, headwearuser.id);
				return;
			}
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			// Build data tree:
			let data = {
				textarray: "texts_mitten",
				textdata: {
					interactionuser: interaction.user,
					targetuser: targetuser,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: getMittenName(interaction.user.id, chosenmittens) ?? "Standard Mittens",
				},
			};

			if (data.textdata.c2 == undefined) {
				// Something went CRITICALLY wrong. Eject, eject!
				interaction.reply({ content: `Something went wrong with your input. Please let Enraa know with the exact thing you put in the Type field!`, flags: MessageFlags.Ephemeral });
				return;
			}

            let blocked = false;
            if (chosenmittens) {
                let tags = getUserTags(targetuser.id);
                let i = getBaseMitten(chosenmittens)
                tags.forEach((t) => {
                    if (i && i.tags && i.tags[t] && (targetuser != interaction.user)) {
                        interaction.reply({ content: `${targetuser}'s content settings forbid this item - ${i.name}!`, flags: MessageFlags.Ephemeral })
                        blocked = true;
                        return;
                    }
                })
            }
            if (blocked) {
                return;
            }

			if (getHeavy(interaction.user.id)) {
				data.heavy = true;
				interaction.reply(getText(data));
			} else if (getMitten(interaction.user.id)) {
				data.mitten = true;
				interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
			} else {
				// Not mittened
				data.nomitten = true;
                if (interaction.user.id == targetuser.id) {
                    data.self = true;
					if (getGag(interaction.user.id)) {
						// Wearing a gag already.
						data.gag = true;
						interaction.reply(getText(data));
						assignMitten(interaction.user.id, chosenmittens);
					} else {
						// Not wearing a gag
						data.nogag = true;
						interaction.reply(getText(data));
						assignMitten(interaction.user.id, chosenmittens);
					}
                }
                else {
                    data.other = true;
                    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                    await handleMajorRestraint(interaction.user, targetuser, "mitten", chosenmittens).then(async () => {
                        await handleExtremeRestraint(interaction.user, targetuser, "mitten", chosenmittens).then(
                            async (success) => {
                                if (getGag(targetuser.id)) {
                                    data.gag = true;
                                }
                                else {
                                    data.nogag = true;
                                }
                                await interaction.followUp({ content: `Equipping ${data.textdata.c2}`, withResponse: true, flags: MessageFlags.Ephemeral });
                                await interaction.followUp(getText(data));
                                assignMitten(targetuser.id, chosenmittens);
                            },
                            async (reject) => {
                                let nomessage = `${targetuser} rejected the ${data.textdata.c2}.`;
                                if (reject == "Disabled") {
                                    nomessage = `${data.textdata.c2} is currently disabled in ${targetuser}'s Extreme options.`;
                                }
                                if (reject == "Error") {
                                    nomessage = `Something went wrong - Submit a bug report!`;
                                }
                                if (reject == "NoDM") {
                                    nomessage = `Something went wrong sending a DM to ${targetuser}, or ${getPronouns(targetuser.id, "subject")} ${getPronouns(targetuser.id, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent for this restraint.`;
                                }
                                await interaction.followUp({ content: nomessage });
                            },
                        );
                    },
                    async (reject) => {
                        let nomessage = `${targetuser} rejected the ${data.textdata.c2}.`;
                        if (reject == "Disabled") {
                            nomessage = `${targetuser} has disabled being bound in major restraints without a collar.`;
                        }
                        if (reject == "Error") {
                            nomessage = `Something went wrong - Submit a bug report!`;
                        }
                        if (reject == "NoDM") {
                            nomessage = `Something went wrong sending a DM to ${targetuser}, or ${getPronouns(targetuser.id, "subject")} ${getPronouns(targetuser.id, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent for this restraint.`;
                        }
                        if (reject == "Cooldown") {
                            nomessage = `${targetuser} has blocked major bondage restraints for now. Please try again in the future.`;
                        }
                        await interaction.followUp({ content: nomessage });
                    })
                }
			}
		} catch (err) {
			console.log(err);
		}
	},
    async help(userid, page) {
        let restrictedtext = (getMitten(userid)) ? `***You cannot remove your mittens***\n` : ""
        let overviewtext = `## Mitten
### Usage: /mitten (type)
### Remove:  /unmitten (user)
-# Restricted if wearing mittens
${restrictedtext}
Applies mittens to yourself. Mittens prevent the use of **/gag** and **/mask**, as well as **/unmitten**. If you apply mittens to yourself, others will be able to gag you without you being able to remove it!`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
