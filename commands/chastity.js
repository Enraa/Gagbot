const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { getChastity, assignChastity, getChastityName } = require("./../functions/vibefunctions.js");
const { calculateTimeout } = require("./../functions/timefunctions.js");
const { getHeavy, getHeavyBound } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent, handleMajorRestraint, handleExtremeRestraint, generateExtraConfig } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { getChastityBra } = require("../functions/vibefunctions.js");
const { assignChastityBra, getChastityBraName } = require("../functions/vibefunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getBaseChastity } = require("../functions/chastityfunctions.js");
const { getUserTags } = require("../functions/configfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("chastity")
		.setDescription("Put yourself in chastity, locking /toy settings")
		//.addUserOption((opt) => opt.setName("keyholder").setDescription("Keyholder (leave blank to lock yourself)"))
        .addUserOption((opt) => opt.setName("user").setDescription("Who to put a chastity device on?"))
		.addStringOption((opt) => opt.setName("braorbelt").setDescription("Chastity belt or bra?").setChoices({ name: "Chastity Belt", value: "chastitybelt" }, { name: "Chastity Bra", value: "chastitybra" }))
		.addStringOption((opt) => opt.setName("type").setDescription("What flavor of cruel chastity to wear...").setAutocomplete(true)),
	async autoComplete(interaction) {
		try {
            const focusedValue = interaction.options.getFocused();
            let beltorbra = interaction.options.get("braorbelt")?.value ?? "chastitybelt";
            let autocompletes = process.autocompletes[beltorbra];
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
                let i = getBaseChastity(f.value)
                tags.forEach((t) => {
                    if (i.tags && i.tags.includes(t)) { tagged = true }
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
			let chastityuser = interaction.options.getUser("user") ?? interaction.user;
			let chastitykeyholder = interaction.user;
			let braorbelt = interaction.options.getString("braorbelt") ?? "chastitybelt";
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let bondagetype = interaction.options.getString("type");

			// Build data tree:
			let data = {
				textarray: "texts_chastity",
				textdata: {
					interactionuser: interaction.user,
					chastityuser: chastityuser,
					c1: getHeavy(interaction.user.id)?.displayname, // heavy bondage type
					c2: (braorbelt == "chastitybelt" ? getChastityName(chastityuser, bondagetype) : getChastityBraName(chastityuser, bondagetype)) ?? (braorbelt == "chastitybelt" ? "chastity belt" : "chastity bra"),
                    c3: `<@${braorbelt == "chastitybelt" ? getChastity(chastityuser)?.keyholder : getChastityBra(chastityuser)?.keyholder}>`
				},
			};
            if (braorbelt == "chastitybelt") {
                if (bondagetype && !getChastityName(interaction.user.id, bondagetype)) {
                    bondagetype = undefined; // Just delete it, we got something invalid lol
                }
            }
			else {
                if (bondagetype && !getChastityBraName(interaction.user.id, bondagetype)) {
                    bondagetype = undefined; // Just delete it, we got something invalid lol
                }
            }
            if (chastityuser.id == interaction.user.id) {
                data.self = true;
            }
            else {
                data.other = true;
            }

			data[braorbelt] = true;
			if (braorbelt == "chastitybelt") {
				// They are trying to put on a chastity belt.
				// Check if the wearer is in an armbinder - if they are, block them.
				if (!getHeavyBound(interaction.user.id, chastityuser.id)) {
					data.heavy = true;
					if (getChastity(chastityuser.id)) {
						// User is in some form of heavy bondage and already has a chastity belt
						data.chastity = true;
						interaction.reply(getText(data));
					} else {
						// User is in some form of heavy bondage and cannot put on a chastity belt
						data.nochastity = true;
						interaction.reply(getText(data));
					}
				} else if (getChastity(chastityuser.id)?.keyholder) {
					data.noheavy = true;
					data.chastity = true;
					if (getChastity(chastityuser.id)?.keyholder == interaction.user.id) {
						// User tries to lock another belt on target and they have the key
						data.key_self = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					} else {
						// User tries to lock another belt on target and someone else has the key
						data.key_other = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				} else {
					data.noheavy = true;
					data.nochastity = true;
					if (chastitykeyholder) {
                        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                        await handleMajorRestraint(interaction.user, chastityuser, "chastity", bondagetype ?? "belt_silver").then(async () => {
                            await handleExtremeRestraint(interaction.user, chastityuser, "chastity", bondagetype ?? "belt_silver").then(
                                async (success) => {
                                    await interaction.followUp({ content: `Equipping ${bondagetype ? getBaseChastity(bondagetype)?.name : "Standard Chastity Belt"}`, flags: MessageFlags.Ephemeral })
                                    let followupmessage = await generateExtraConfig(interaction, chastityuser.id, bondagetype, true)
                                    if (followupmessage) { 
                                        await interaction.followUp(followupmessage) 
                                    };
                                    await interaction.followUp(getText(data));
                                    assignChastity(chastityuser.id, chastitykeyholder.id, bondagetype);
                                },
                                async (reject) => {
                                    let nomessage = `${chastityuser} rejected the ${bondagetype ? getBaseChastity(bondagetype).name : "chastity belt"}.`;
                                    if (reject == "Disabled") {
                                        nomessage = `${bondagetype ? getBaseChastity(bondagetype).name : "chastity belt"} is currently disabled in ${chastityuser}'s Extreme options.`;
                                    }
                                    if (reject == "Error") {
                                        nomessage = `Something went wrong - Submit a bug report!`;
                                    }
                                    if (reject == "NoDM") {
                                        nomessage = `Something went wrong sending a DM to ${chastityuser}, or ${getPronouns(chastityuser.id, "subject")} ${getPronouns(chastityuser.id, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent for this restraint.`;
                                    }
                                    await interaction.followUp({ content: nomessage });
                                },
                            );
                        },
                        async (reject) => {
                            let nomessage = `${chastityuser} rejected the ${bondagetype ? getBaseChastity(bondagetype).name : "chastity belt"}.`;
                            if (reject == "Disabled") {
                                nomessage = `${chastityuser} has disabled being bound in major restraints without a collar.`;
                            }
                            if (reject == "Error") {
                                nomessage = `Something went wrong - Submit a bug report!`;
                            }
                            if (reject == "NoDM") {
                                nomessage = `Something went wrong sending a DM to ${chastityuser}, or ${getPronouns(chastityuser.id, "subject")} ${getPronouns(chastityuser.id, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent for this restraint.`;
                            }
                            if (reject == "Cooldown") {
                                nomessage = `${chastityuser} has blocked major bondage restraints for now. Please try again in the future.`;
                            }
                            await interaction.followUp({ content: nomessage });
                        })
					} else {
						// Left it unlocked ---- This is currently an unused data path as there will ALWAYS be a keyholder.
						interaction.reply(`${interaction.user} puts a chastity belt on and clicks a tiny lock on it before stashing the key for safekeeping!`);
						assignChastity(interaction.user.id, interaction.user.id);
					}
				}
			} else {
				// They are trying to put on a chastity bra.
				// Check if the wearer is in an armbinder - if they are, block them.
				if (!getHeavyBound(interaction.user.id, chastityuser.id)) {
					data.heavy = true;
					if (getChastityBra(chastityuser.id)) {
						// User is in some form of heavy bondage and already has a chastity belt
						data.chastity = true;
						interaction.reply(getText(data));
					} else {
						// User is in some form of heavy bondage and cannot put on a chastity belt
						data.nochastity = true;
						interaction.reply(getText(data));
					}
				} else if (getChastityBra(chastityuser.id)?.keyholder) {
					data.noheavy = true;
					data.chastity = true;
					if (getChastityBra(chastityuser.id)?.keyholder == interaction.user.id) {
						// User tries to lock another belt on themselves and they have the key
						data.key_self = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					} else {
						// User tries to lock another belt on themselves and someone else has the key
						data.key_other = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				} else {
					data.noheavy = true;
					data.nochastity = true;
					if (chastitykeyholder) {
                        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                        await handleMajorRestraint(interaction.user, chastityuser, "chastitybra", bondagetype ?? "bra_silver").then(async () => {
                            await handleExtremeRestraint(interaction.user, chastityuser, "chastitybra", bondagetype ?? "bra_silver").then(
                                async (success) => {
                                    await interaction.followUp({ content: `Equipping ${bondagetype ? getBaseChastity(bondagetype)?.name : "Standard Chastity Bra"}`, flags: MessageFlags.Ephemeral })
                                    let followupmessage = await generateExtraConfig(interaction, chastityuser.id, bondagetype, true)
                                    if (followupmessage) { 
                                        await interaction.followUp(followupmessage) 
                                    };
                                    await interaction.followUp(getText(data));
                                    assignChastityBra(chastityuser.id, chastitykeyholder.id, bondagetype);
                                },
                                async (reject) => {
                                    let nomessage = `${chastityuser} rejected the ${bondagetype ? getBaseChastity(bondagetype).name : "chastity bra"}.`;
                                    if (reject == "Disabled") {
                                        nomessage = `${bondagetype ? getBaseChastity(bondagetype).name : "chastity bra"} is currently disabled in ${chastityuser}'s Extreme options.`;
                                    }
                                    if (reject == "Error") {
                                        nomessage = `Something went wrong - Submit a bug report!`;
                                    }
                                    if (reject == "NoDM") {
                                        nomessage = `Something went wrong sending a DM to ${chastityuser}, or ${getPronouns(chastityuser.id, "subject")} ${getPronouns(chastityuser.id, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent for this restraint.`;
                                    }
                                    await interaction.followUp({ content: nomessage });
                                },
                            );
                        },
                        async (reject) => {
                            let nomessage = `${chastityuser} rejected the ${bondagetype ? getBaseChastity(bondagetype).name : "chastity bra"}.`;
                            if (reject == "Disabled") {
                                nomessage = `${chastityuser} has disabled being bound in major restraints without a collar.`;
                            }
                            if (reject == "Error") {
                                nomessage = `Something went wrong - Submit a bug report!`;
                            }
                            if (reject == "NoDM") {
                                nomessage = `Something went wrong sending a DM to ${chastityuser}, or ${getPronouns(chastityuser.id, "subject")} ${getPronouns(chastityuser.id, "subject") == "they" ? `have` : "has"} DMs from this server disabled. Cannot obtain consent for this restraint.`;
                            }
                            if (reject == "Cooldown") {
                                nomessage = `${chastityuser} has blocked major bondage restraints for now. Please try again in the future.`;
                            }
                            await interaction.followUp({ content: nomessage });
                        })
						if (bondagetype) {
							// Named chastity belt
							data.namedchastity = true;
							interaction.reply(getText(data));
							assignChastityBra(chastityuser.id, chastitykeyholder.id, bondagetype);
						} else {
							// Not a named chastity belt
							data.nonamedchastity = true;
							interaction.reply(getText(data));
							assignChastityBra(chastityuser.id, chastitykeyholder.id, bondagetype);
						}
					} else {
						// Left it unlocked ---- This is currently an unused data path as there will ALWAYS be a keyholder.
						interaction.reply(`${interaction.user} puts a chastity bra on and clicks a tiny lock on it before stashing the key for safekeeping!`);
						assignChastityBra(interaction.user.id, interaction.user.id);
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
    async help(userid, page) {
        let restrictedtext = (getChastity(userid) || getChastityBra(userid)) ? `***You may be unable to use this command due to worn chastity***\n` : ""
        let overviewtext = `## Chastity
### Usage: /chastity (keyholder) (braorbelt) (type)
### Remove:  /unchastity (user)
-# Restricted if not holding the device's key or in heavy bondage
${restrictedtext}
Applies a **Chastity Belt** or **Chastity Bra** to yourself, which will prevent the use of commands to change, add or remove certain **Toys** on you, as well as **Corsets** when wearing a **Chastity Belt**. Chastity will increase the threshold required to successfully **/letgo** and can potentially have other arousing effects. If configured, worn time with chastity can contribute to Frustration which impacts fumble chance when unlocking the device.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
