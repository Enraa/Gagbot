const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getBaseToy, getSpecificToy, userBlockArousingToy, assignToy } = require("../functions/toyfunctions");
const { getText } = require("../functions/textfunctions");
const { getConsent } = require("../functions/interactivefunctions");
const { getHeavy } = require("../functions/heavyfunctions");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("toy")
		.setDescription("Add a vibrator/toy, causing stuttered speech and other effects")
		.addUserOption((opt) => opt.setName("user").setDescription("Who to add a fun toy to"))
		.addStringOption((opt) =>
			opt.setName("type")
			.setDescription("What kind of toy to add")
            .setAutocomplete(true)
		)
		.addNumberOption((opt) => opt.setName("intensity").setDescription("How intensely to run the toy").setMinValue(1).setMaxValue(20)),
	async autoComplete(interaction) {
        try {
            const focusedValue = interaction.options.getFocused();
            let autocompletes = process.autocompletes.toys;
            console.log(autocompletes)
            let matches = didYouMean(focusedValue, autocompletes, {
                matchPath: ['name'], 
                returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
            })
            
            if (matches.length == 0) {
                matches = autocompletes;
            }
            interaction.respond(matches.slice(0,25))
        }
        catch (err) {
            console.log(err);
        }
    },
    async execute(interaction) {
        try {
            let toyuser = interaction.options.getUser("user") ?? interaction.user;
            let toyintensity = interaction.options.getNumber("intensity") ?? 5;
            let toytype = interaction.options.getString("type") ?? "vibe_bullet"
            let toybase = getBaseToy(toytype);
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(toyuser.id)?.mainconsent) {
                await handleConsent(interaction, toyuser.id);
                return;
            }
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            if (userBlockArousingToy(toyuser.id, toytype)) {
                if (toyuser.id == interaction.user.id) {
                    interaction.reply({ content: `You have disabled the Arousal System in **/config** and would not be affected by this toy. Please review the Arousal System setting and enable it to use arousing toys.`, flags: MessageFlags.Ephemeral });
                } else {
                    interaction.reply({ content: `${toyuser} has disabled the Arousal System in **/config** and would not be affected by this toy.`, flags: MessageFlags.Ephemeral });
                }
                return;
            }

            let data = {
				textarray: "texts_toy",
				textdata: {
					interactionuser: interaction.user,
					targetuser: toyuser,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: getBaseToy(toytype).toyname, // the chosen vibe type
					c3: toyintensity,
				},
			};

            // REFLECT
            if (toyuser.id == process.client.user.id) {
                data.toyreflect = true;
                data.textdata.interactionuser = process.client.user;
                data.textdata.targetuser = interaction.user;
                interaction.reply({ content: `Gagbot recognizes what you're attempting to do. Cheeky.`, flags: MessageFlags.Ephemeral });
                return;
            }

            if (getHeavy(interaction.user.id)) {
				// We are in heavy bondage
				data.heavy = true;
				if (toyuser == interaction.user) {
					// ourselves
					data.self = true;
					if (toybase.canEquip({ userID: toyuser.id, keyholderID: interaction.user.id })) {
						// can equip
						data.access = true;
                        data[toybase.category] = true;
                        interaction.reply(getText(data))
					} else {
						// cannot equip
						data.noaccess = true;
                        data[toybase.category] = true;
                        interaction.reply(getText(data))
					}
				} else {
					// someone else
					data.other = true;
					if (toybase.canEquip({ userID: toyuser.id, keyholderID: interaction.user.id })) {
						// cannot equip
						data.access = true;
                        data[toybase.category] = true;
                        interaction.reply(getText(data))
					} else {
						// can equip
						data.noaccess = true;
                        data[toybase.category] = true;
                        interaction.reply(getText(data))
					}
				}
            }
            else {
                // not in heavy bondage
                data.noheavy = true;
                if (toyuser == interaction.user) {
                    // self
                    data.self = true;
                    if (getSpecificToy(toyuser.id, toytype)) {
                        // toy already on wearer
                        data.toy = true;
                        if (toybase.blocker({ userID: toyuser.id })) {
                            data.blocker = true
                            if (toybase.canModify({ userID: toyuser.id, keyholderID: interaction.user.id })) {
                                // can access the toy
                                data.access = true;
                                data[toybase.category] = true;
                                let fumble = toybase.fumble({ userID: toyuser.id, keyholderID: interaction.user.id })
                                if (fumble > 0) {
                                    // We fumbled the key
                                    data.fumble = true;
                                    if (fumble > 1) {
                                        // We lost the key
                                        data.keyloss = true;
                                        let discardresult = toybase.discard({ userID: toyuser.id, keyholderID: interaction.user.id })
                                        if (discardresult) { data[discardresult] = true }
                                        interaction.reply(getText(data))
                                    }
                                    else {
                                        // Fumbled, didn't lose key
                                        data.nokeyloss = true;
                                        interaction.reply(getText(data))
                                    }
                                }
                                else {
                                    // Successfully unlocked blocking device
                                    data.nofumble = true;
                                    assignToy(toyuser.id, interaction.user.id, toyintensity, toytype, interaction.user.id);
                                    interaction.reply(getText(data))
                                }
                            }
                            else {
                                // Cannot access the blocking device
                                data.noaccess = true;
                                data[toybase.category] = true;
                                interaction.reply(getText(data))
                            }
                        }
                        else {
                            // Not wearing chastity or anything
                            data.noblocker = true
                            data[toybase.category] = true;
                            assignToy(toyuser.id, interaction.user.id, toyintensity, toytype, interaction.user.id);
                            interaction.reply(getText(data))
                        }
                    }
                    else {
                        // Toy is not already worn!
                        data.notoy = true;
                        if (toybase.blocker({ userID: toyuser.id })) {
                            data.blocker = true
                            if (toybase.canEquip({ userID: toyuser.id, keyholderID: interaction.user.id })) {
                                // can put the toy on them
                                data.access = true;
                                data[toybase.category] = true;
                                let fumble = toybase.fumble({ userID: toyuser.id, keyholderID: interaction.user.id })
                                if (fumble > 0) {
                                    // We fumbled the key
                                    data.fumble = true;
                                    if (fumble > 1) {
                                        // We lost the key
                                        data.keyloss = true;
                                        let discardresult = toybase.discard({ userID: toyuser.id, keyholderID: interaction.user.id })
                                        if (discardresult) { data[discardresult] = true }
                                        interaction.reply(getText(data))
                                    }
                                    else {
                                        // Fumbled, didn't lose key
                                        data.nokeyloss = true;
                                        interaction.reply(getText(data))
                                    }
                                }
                                else {
                                    // Successfully unlocked blocking device
                                    data.nofumble = true;
                                    assignToy(toyuser.id, interaction.user.id, toyintensity, toytype, interaction.user.id);
                                    interaction.reply(getText(data))
                                }
                            }
                            else {
                                // Cannot access the blocking device
                                data.noaccess = true;
                                data[toybase.category] = true;
                                interaction.reply(getText(data))
                            }
                        }
                        else {
                            // Not wearing chastity or anything
                            data.noblocker = true
                            data[toybase.category] = true;
                            assignToy(toyuser.id, interaction.user.id, toyintensity, toytype, interaction.user.id);
                            interaction.reply(getText(data))
                        }
                    }
                }
                else {
                    // other
                    data.other = true;
                    if (getSpecificToy(toyuser.id, toytype)) {
                        // toy already on wearer
                        data.toy = true;
                        if (toybase.blocker({ userID: toyuser.id })) {
                            data.blocker = true;
                            if (toybase.canModify({ userID: toyuser.id, keyholderID: interaction.user.id })) {
                                // can access the toy
                                data.access = true;
                                data[toybase.category] = true;
                                let fumble = toybase.fumble({ userID: toyuser.id, keyholderID: interaction.user.id })
                                if (fumble > 0) {
                                    // We fumbled the key
                                    data.fumble = true;
                                    if (fumble > 1) {
                                        // We lost the key
                                        data.keyloss = true;
                                        let discardresult = toybase.discard({ userID: toyuser.id, keyholderID: interaction.user.id })
                                        if (discardresult) { data[discardresult] = true }
                                        interaction.reply(getText(data))
                                    }
                                    else {
                                        // Fumbled, didn't lose key
                                        data.nokeyloss = true;
                                        interaction.reply(getText(data))
                                    }
                                }
                                else {
                                    // Successfully unlocked blocking device
                                    data.nofumble = true;
                                    assignToy(toyuser.id, interaction.user.id, toyintensity, toytype, interaction.user.id);
                                    interaction.reply(getText(data))
                                }
                            }
                            else {
                                // Cannot access the blocking device
                                data.noaccess = true;
                                data[toybase.category] = true;
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
                        else {
                            // Not wearing chastity or anything
                            data.noblocker = true
                            data[toybase.category] = true;
                            assignToy(toyuser.id, interaction.user.id, toyintensity, toytype, interaction.user.id);
                            interaction.reply(getText(data))
                        }
                    }
                    else {
                        // Toy is not already worn!
                        data.notoy = true;
                        if (toybase.blocker({ userID: toyuser.id })) {
                            data.blocker = true;
                            if (toybase.canEquip({ userID: toyuser.id, keyholderID: interaction.user.id })) {
                                // can put the toy on them
                                data.access = true;
                                data[toybase.category] = true;
                                let fumble = toybase.fumble({ userID: toyuser.id, keyholderID: interaction.user.id })
                                if (fumble > 0) {
                                    // We fumbled the key
                                    data.fumble = true;
                                    if (fumble > 1) {
                                        // We lost the key
                                        data.keyloss = true;
                                        let discardresult = toybase.discard({ userID: toyuser.id, keyholderID: interaction.user.id })
                                        if (discardresult) { data[discardresult] = true }
                                        interaction.reply(getText(data))
                                    }
                                    else {
                                        // Fumbled, didn't lose key
                                        data.nokeyloss = true;
                                        interaction.reply(getText(data))
                                    }
                                }
                                else {
                                    // Successfully unlocked blocking device
                                    data.nofumble = true;
                                    assignToy(toyuser.id, interaction.user.id, toyintensity, toytype, interaction.user.id);
                                    interaction.reply(getText(data))
                                }
                            }
                            else {
                                // Cannot access the blocking device
                                data.noaccess = true;
                                data[toybase.category] = true;
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
                        else {
                            // Not wearing chastity or anything
                            data.noblocker = true
                            data[toybase.category] = true;
                            assignToy(toyuser.id, interaction.user.id, toyintensity, toytype, interaction.user.id);
                            interaction.reply(getText(data))
                        }
                    }
                }
            }
            console.log(data);
        }
        catch (err) {
            console.log(err);
        }
    },
    async help(userid, page) {
        let overviewtext = `## Toy
### Usage: /toy (user) (type)
### Remove:  /untoy (user) (type)
-# Certain toys have various restrictions

Applies a toy to a user, with differing effects on what each toy can do. Different toys can be blocked by different restraints.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
}