const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getWearable, assignWearable, getWearableName } = require('../functions/wearablefunctions.js');
const { getText } = require("./../functions/textfunctions.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('wear')
		.setDescription(`Apply fashion to someone. . .`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to apply fashion to?')
		)
        .addStringOption(opt =>
			opt.setName('type')
			.setDescription('What fashion to wear...')
			.setAutocomplete(true)
		),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
		let chosenuserid = interaction.options.get('user')?.value ?? interaction.user.id // Note we can only retrieve the user ID here!
		if (focusedValue == "") { // User hasn't entered anything, lets give them a suggested set of 10
			let itemsworn = getWearable(chosenuserid)

			// Remove anything we're already wearing from the list
			let sorted = process.wearableslist.filter(f => !itemsworn.includes(f.value))
			await interaction.respond(sorted.slice(0,20))
		}
		else {
            try {
				let itemsworn = getWearable(chosenuserid)

				// Remove anything we're already wearing from the list
				let sorted = process.wearableslist.filter(f => !itemsworn.includes(f.value))
                let headstoreturn = sorted.filter((f) => (f.name.toLowerCase()).includes(focusedValue.toLowerCase())).slice(0,20)
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
			let wearablechoice = interaction.options.getString('type') ? interaction.options.getString('type') : "catsuit_latex"
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
					c2: getWearableName(wearableuser.id, wearablechoice)
                }
            }

			if (data.textdata.c2 == undefined) {
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
					if (getWearable(wearableuser.id).includes(wearablechoice)) {
						// Wearing the headgear already, Ephemeral
						data.worn = true
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
					}
					else {
						// Not wearing it!
						data.noworn = true
						interaction.reply(getText(data))
					}
				}
				else {
					// Them
					data.other = true;
					if (getWearable(wearableuser.id).includes(wearablechoice)) {
						// Wearing the headgear already, Ephemeral
						data.worn = true
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
					}
					else {
						// Not wearing it!
						data.noworn = true
						interaction.reply(getText(data))
					}
				}
			}
			else {
				// Not in heavy bondage
				data.noheavy = true;
                if (wearableuser.id == interaction.user.id) {
                    // ourselves
                    data.self = true;
                    if (getWearable(wearableuser.id).includes(wearablechoice)) {
                        // Wearing the headgear already, Ephemeral
                        data.worn = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                    else {
                        // Not wearing it!
                        data.noworn = true
                        assignWearable(wearableuser.id, wearablechoice)
                        interaction.reply(getText(data))
                    }
                }
                else {
                    // Them
                    data.other = true;
                    if (getWearable(wearableuser.id).includes(wearablechoice)) {
                        // Wearing the headgear already, Ephemeral
                        data.worn = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                    else {
                        // Not wearing it!
                        data.noworn = true
                        assignWearable(wearableuser.id, wearablechoice)
                        interaction.reply(getText(data))
                    }
                }

			}
		}
		catch (err) {
			console.log(err)
		}
    }
}