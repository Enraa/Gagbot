const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getWearable, getWearableName, deleteWearable, getLockedWearable } = require('../functions/wearablefunctions.js');
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unwear')
		.setDescription(`Remove fashion from someone. . .`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to remove fashion from?')
		)
        .addStringOption(opt =>
			opt.setName('type')
			.setDescription('What fashion to remove...')
			.setAutocomplete(true)
		),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
        let chosenuserid = interaction.options.get('user')?.value ?? interaction.user.id // Note we can only retrieve the user ID here!
		if (focusedValue == "") { // User hasn't entered anything, lets give them a suggested set of 10
			let itemsworn = getWearable(chosenuserid)
            let itemslocked = getLockedWearable(chosenuserid)
            
			// Remove anything we're already wearing from the list
			let sorted = process.wearableslist.filter(f => itemsworn.includes(f.value))
            sorted = sorted.filter(f => !itemslocked.includes(f.value))
			await interaction.respond(sorted.slice(0,10))
		}
		else {
            try {
                let itemsworn = getWearable(chosenuserid)
                let itemslocked = getLockedWearable(chosenuserid)

			    // Remove anything we're already wearing from the list
			    let sorted = process.wearableslist.filter(f => itemsworn.includes(f.value))
                sorted = sorted.filter(f => !itemslocked.includes(f.value))
                let headstoreturn = sorted.filter((f) => (f.name.toLowerCase()).includes(focusedValue.toLowerCase())).slice(0,10)
			    await interaction.respond(headstoreturn)
            }
			catch (err) {
                console.log(err);
            }
		}
	},
    async execute(interaction) {
		try {
			let wearableuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
			let wearablechoice = interaction.options.getString('type')
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
                textarray: "texts_unwear",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: wearableuser,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: getWearableName(wearableuser.id, wearablechoice)
                }
            }

            if (wearablechoice && data.textdata.c2 == undefined) {
                // Something went CRITICALLY wrong. Eject, eject!
                interaction.reply({ content: `Something went wrong with your input. Please let Enraa know with the exact thing you put in the Type field!`, flags: MessageFlags.Ephemeral })
                return;
            }

			if (getHeavy(interaction.user.id)) {
				// target is in heavy bondage
				data.heavy = true;
				if (wearableuser.id == interaction.user.id) {
					// ourselves
					data.self = true;
                    if (wearablechoice) {
                        // We're targetting a specific wearable piece. 
                        data.single = true
                        if (getWearable(wearableuser.id).includes(wearablechoice)) {
                            // Wearing the headgear already
                            data.worn = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // Not wearing it! Ephemeral!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // We're removing ALL wearable
                        data.multiple = true
                        if (getWearable(wearableuser.id).length > 0) {
                            // Wearing something
                            data.worn = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // Not wearing it! Ephemeral!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
				}
				else {
					// Them
					data.other = true;
					if (wearablechoice) {
                        // We're targetting a specific wearable piece. 
                        data.single = true
                        if (getWearable(wearableuser.id).includes(wearablechoice)) {
                            // Wearing the headgear already
                            data.worn = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // Not wearing it! Ephemeral!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // We're removing ALL wearable
                        data.multiple = true
                        if (getWearable(wearableuser.id).length > 0) {
                            // Wearing something
                            data.worn = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // Not wearing it! Ephemeral!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
				}
			}
			else {
				// Not in heavy bondage
				data.noheavy = true;
                if (wearableuser.id == interaction.user.id) {
                    // ourselves
                    data.self = true;
                    if (wearablechoice) {
                        // Targetting one specific headgear
                        data.single = true
                        if (getWearable(wearableuser.id).includes(wearablechoice)) {
                            // Wearing the headgear already, Ephemeral
                            data.worn = true
                            interaction.reply(getText(data))
                            deleteWearable(wearableuser.id, wearablechoice)
                        }
                        else {
                            // Not wearing it!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // Targetting all headgear
                        data.multiple = true
                        if (getWearable(wearableuser.id).length > 0) {
                            // Wearing the headgear already, Ephemeral
                            data.worn = true
                            interaction.reply(getText(data))
                            deleteWearable(wearableuser.id, wearablechoice)
                        }
                        else {
                            // Not wearing it!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                }
                else {
                    // Them
                    data.other = true;
                    if (wearablechoice) {
                        // Targetting one specific headgear
                        data.single = true
                        if (getWearable(wearableuser.id).includes(wearablechoice)) {
                            // Wearing the headgear already, Ephemeral
                            data.worn = true
                            interaction.reply(getText(data))
                            deleteWearable(wearableuser.id, wearablechoice)
                        }
                        else {
                            // Not wearing it!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // Targetting all headgear
                        data.multiple = true
                        if (getWearable(wearableuser.id).length > 0) {
                            // Wearing the headgear already, Ephemeral
                            data.worn = true
                            interaction.reply(getText(data))
                            deleteWearable(wearableuser.id, wearablechoice)
                        }
                        else {
                            // Not wearing it!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                }
			}
		}
		catch (err) {
			console.log(err)
		}
    }
}