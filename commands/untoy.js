const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getBaseToy, getSpecificToy, getToys, removeToy } = require("../functions/toyfunctions");
const { getText } = require("../functions/textfunctions");
const { getConsent } = require("../functions/interactivefunctions");
const { getHeavy } = require("../functions/heavyfunctions");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("untoy")
		.setDescription("Remove a Toy")
		.addUserOption((opt) => opt.setName("user").setDescription("Who to add a fun toy to"))
		.addStringOption((opt) =>
			opt.setName("type")
			.setDescription("What kind of toy to add")
            .setAutocomplete(true)
		),
	async autoComplete(interaction) {
        try {
            const focusedValue = interaction.options.getFocused();
            let chosenuserid = interaction.options.get("user")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
            let autocompletes = getToys(chosenuserid).map((t) => { return { name: getBaseToy(t.type).toyname, value: t.type }})
            console.log(autocompletes)
            let matches = didYouMean(focusedValue, autocompletes, {
                matchPath: ['name'], 
                returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
            })
            
            if (matches.length == 0) {
                matches = autocompletes;
            }
            if (matches.length == 0) {
                matches = [
                    { name: "Nothing to Remove", value: "nothing "}
                ]
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
            let toytype = interaction.options.getString("type");
            if ((toytype == undefined) && (getToys(toyuser.id)) && (getToys(toyuser.id).length > 0)) {
                toytype = getToys(toyuser.id)[0]?.type
            }
            if (toytype == undefined) {
                interaction.reply({ content: `${toyuser} is not wearing any toys!`, flags: MessageFlags.Ephemeral })
                return;
            }
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

            let data = {
				textarray: "texts_untoy",
				textdata: {
					interactionuser: interaction.user,
					targetuser: toyuser,
					c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: getBaseToy(toytype)?.toyname, // the chosen vibe type
					c3: toyintensity,
				},
			};

            // REFLECT
            /*if (toyuser.id == process.client.user.id) {
                data.toyreflect = true;
                data.textdata.interactionuser = process.client.user;
                data.textdata.targetuser = interaction.user;
                interaction.reply({ content: `Gagbot recognizes what you're attempting to do. Cheeky.`, flags: MessageFlags.Ephemeral });
                return;
            }*/

            if (getHeavy(interaction.user.id)) {
				// We are in heavy bondage
				data.heavy = true;
				if (toyuser == interaction.user) {
					// ourselves
					data.self = true;
					if (toybase.canUnequip({ userID: toyuser.id, keyholderID: interaction.user.id })) {
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
				} else {
					// someone else
					data.other = true;
					if (toybase.canUnequip({ userID: toyuser.id, keyholderID: interaction.user.id })) {
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
                            data.blocker = true;
                            if (toybase.canUnequip({ userID: toyuser.id, keyholderID: interaction.user.id })) {
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
                                    removeToy(toyuser.id, toytype)
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
                            // Not wearing anything to block access
                            data.noblocker = true;
                            data[toybase.category] = true;
                            removeToy(toyuser.id, toytype)
                            interaction.reply(getText(data))
                        }
                    }
                    else {
                        // Toy is not already worn!
                        data.notoy = true;
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
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
                            if (toybase.canUnequip({ userID: toyuser.id, keyholderID: interaction.user.id })) {
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
                                    removeToy(toyuser.id, toytype)
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
                            // Not wearing anything to block access
                            data.noblocker = true;
                            data[toybase.category] = true;
                            removeToy(toyuser.id, toytype)
                            interaction.reply(getText(data))
                        }
                    }
                    else {
                        // Toy is not already worn!
                        data.notoy = true;
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}