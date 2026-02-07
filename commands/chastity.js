const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { getChastity, assignChastity, getChastityName } = require("./../functions/vibefunctions.js");
const { calculateTimeout } = require("./../functions/timefunctions.js");
const { getHeavy } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent } = require("./../functions/interactivefunctions.js");
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
		.addUserOption((opt) => opt.setName("keyholder").setDescription("Keyholder (leave blank to lock yourself)"))
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
			let chastityuser = interaction.user;
			let chastitykeyholder = interaction.options.getUser("keyholder") ? interaction.options.getUser("keyholder") : interaction.user;
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
					targetuser: chastitykeyholder,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: (braorbelt == "chastitybelt" ? getChastityName(interaction.user.id, bondagetype) : getChastityBraName(interaction.user.id, bondagetype)) ?? (braorbelt == "chastitybelt" ? "chastity belt" : "chastity bra"),
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

			data[braorbelt] = true;
			if (braorbelt == "chastitybelt") {
				// They are trying to put on a chastity belt.
				// Check if the wearer is in an armbinder - if they are, block them.
				if (getHeavy(interaction.user.id)) {
					data.heavy = true;
					if (getChastity(interaction.user.id)) {
						// User is in some form of heavy bondage and already has a chastity belt
						data.chastity = true;
						interaction.reply(getText(data));
					} else {
						// User is in some form of heavy bondage and cannot put on a chastity belt
						data.nochastity = true;
						interaction.reply(getText(data));
					}
				} else if (getChastity(interaction.user.id)?.keyholder) {
					data.noheavy = true;
					data.chastity = true;
					if (getChastity(interaction.user.id)?.keyholder == interaction.user.id) {
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
						if (bondagetype) {
							// Named chastity belt
							data.namedchastity = true;
							if (interaction.user != chastitykeyholder) {
								// Locked it and giving someone else the key
								data.key_other = true;
								interaction.reply(getText(data));
								assignChastity(interaction.user.id, chastitykeyholder.id, bondagetype);
							} else {
								// Locked it but holding onto the key
								data.key_self = true;
								interaction.reply(getText(data));
								assignChastity(interaction.user.id, chastitykeyholder.id, bondagetype);
							}
						} else {
							// Not a named chastity belt
							data.nonamedchastity = true;
							if (interaction.user != chastitykeyholder) {
								// Locked it and giving someone else the key
								data.key_other = true;
								interaction.reply(getText(data));
								assignChastity(interaction.user.id, chastitykeyholder.id);
							} else {
								// Locked it but holding onto the key
								data.key_self = true;
								interaction.reply(getText(data));
								assignChastity(interaction.user.id, chastitykeyholder.id);
							}
						}
					} else {
						// Left it unlocked ---- This is currently an unused data path as there will ALWAYS be a keyholder.
						interaction.reply(`${interaction.user} puts a chastity belt on and clicks a tiny lock on it before stashing the key for safekeeping!`);
						assignChastity(interaction.user.id, interaction.user.id);
					}
				}
			} else {
				// They are trying to put on a chastity bra.
				// Check if the wearer is in an armbinder - if they are, block them.
				if (getHeavy(interaction.user.id)) {
					data.heavy = true;
					if (getChastityBra(interaction.user.id)) {
						// User is in some form of heavy bondage and already has a chastity belt
						data.chastity = true;
						interaction.reply(getText(data));
					} else {
						// User is in some form of heavy bondage and cannot put on a chastity belt
						data.nochastity = true;
						interaction.reply(getText(data));
					}
				} else if (getChastityBra(interaction.user.id)?.keyholder) {
					data.noheavy = true;
					data.chastity = true;
					if (getChastityBra(interaction.user.id)?.keyholder == interaction.user.id) {
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
						if (bondagetype) {
							// Named chastity belt
							data.namedchastity = true;
							if (interaction.user != chastitykeyholder) {
								// Locked it and giving someone else the key
								data.key_other = true;
								interaction.reply(getText(data));
								assignChastityBra(interaction.user.id, chastitykeyholder.id, bondagetype);
							} else {
								// Locked it but holding onto the key
								data.key_self = true;
								interaction.reply(getText(data));
								assignChastityBra(interaction.user.id, chastitykeyholder.id, bondagetype);
							}
						} else {
							// Not a named chastity belt
							data.nonamedchastity = true;
							if (interaction.user != chastitykeyholder) {
								// Locked it and giving someone else the key
								data.key_other = true;
								interaction.reply(getText(data));
								assignChastityBra(interaction.user.id, chastitykeyholder.id);
							} else {
								// Locked it but holding onto the key
								data.key_self = true;
								interaction.reply(getText(data));
								assignChastityBra(interaction.user.id, chastitykeyholder.id);
							}
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
