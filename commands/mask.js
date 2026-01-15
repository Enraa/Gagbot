const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getHeadwear, assignHeadwear, getHeadwearName } = require('../functions/headwearfunctions.js');
const { getText } = require("./../functions/textfunctions.js");
const { getCollar, getCollarPerm, canAccessCollar } = require('../functions/collarfunctions.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('mask')
		.setDescription(`Apply headwear to someone. . .`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to apply headwear to?')
		)
        .addStringOption(opt =>
			opt.setName('type')
			.setDescription('What headwear to wear...')
			.setAutocomplete(true)
		),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
		let chosenuserid = interaction.options.get('user')?.value ?? interaction.user.id // Note we can only retrieve the user ID here!
		if (focusedValue == "") { // User hasn't entered anything, lets give them a suggested set of 10
			let itemsworn = getHeadwear(chosenuserid)

			// Remove anything we're already wearing from the list
			let sorted = process.headtypes.filter(f => !itemsworn.includes(f.value))
			await interaction.respond(sorted.slice(0,20))
		}
		else {
            try {
				let itemsworn = getHeadwear(chosenuserid)

				// Remove anything we're already wearing from the list
				let sorted = process.headtypes.filter(f => !itemsworn.includes(f.value))
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
			let headwearuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
			let headwearchoice = interaction.options.getString('type') ? interaction.options.getString('type') : "hood_latex"
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(headwearuser.id)?.mainconsent) {
				await handleConsent(interaction, headwearuser.id);
				return;
			}
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let data = {
                textarray: "texts_headwear",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: headwearuser,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: getHeadwearName(headwearuser.id, headwearchoice)
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
				if (headwearuser.id == interaction.user.id) {
					// ourselves
					data.self = true;
					if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
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
					if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
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
				if (getMitten(interaction.user.id)) {
					// Wearing mittens!
					data.mitten = true
					if (headwearuser.id == interaction.user.id) {
						// ourselves
						data.self = true;
						if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
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
						if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
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
					// Not wearing mittens!
					data.nomitten = true
					if (headwearuser.id == interaction.user.id) {
						// ourselves
						data.self = true;
						if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
							// Wearing the headgear already, Ephemeral
							data.worn = true
							interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
						}
						else {
							// Not wearing it!
							data.noworn = true
							interaction.reply(getText(data))
							assignHeadwear(headwearuser.id, headwearchoice)
						}
					}
					else {
						// Them
						data.other = true;
						if (getCollar(headwearuser.id)) {
							data.collar = true
							if (getCollarPerm(headwearuser.id, "mask") && canAccessCollar(headwearuser.id, interaction.user.id)) {
								data.maskperm = true
								if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
									// Wearing the headgear already, Ephemeral
									data.worn = true
									interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
								}
								else {
									// Not wearing it!
									data.noworn = true
									interaction.reply(getText(data))
									assignHeadwear(headwearuser.id, headwearchoice)
								}
							}
							else {
								data.nomaskperm = true
								interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
							}
						}
						else {
							data.nocollar = true
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